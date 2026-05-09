const crypto = require("node:crypto");
const { execFile } = require("node:child_process");
const http = require("node:http");

const port = Number(process.env.WEBHOOK_PORT || 9010);
const secret = process.env.WEBHOOK_SECRET;
const deployScript = process.env.DEPLOY_SCRIPT || "/root/angkasa/scripts/deploy.sh";
const branch = process.env.DEPLOY_BRANCH || "main";

let deploying = false;

function send(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload));
}

function verifySignature(rawBody, signature) {
  if (!secret) return false;
  if (!signature?.startsWith("sha256=")) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function runDeploy(res) {
  if (deploying) {
    send(res, 202, { ok: true, status: "deployment already running" });
    return;
  }

  deploying = true;
  const child = execFile("bash", [deployScript], {
    env: { ...process.env, DEPLOY_BRANCH: branch },
    maxBuffer: 1024 * 1024 * 10
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));
  child.on("close", (code) => {
    deploying = false;
    console.log(`[${new Date().toISOString()}] deploy exited with code ${code}`);
  });

  send(res, 202, { ok: true, status: "deployment started" });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    send(res, 200, { ok: true, service: "angkasa-webhook" });
    return;
  }

  if (req.method !== "POST") {
    send(res, 405, { ok: false, error: "method not allowed" });
    return;
  }

  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const rawBody = Buffer.concat(chunks);
    const event = req.headers["x-github-event"];
    const signature = req.headers["x-hub-signature-256"];

    if (!verifySignature(rawBody, signature)) {
      send(res, 401, { ok: false, error: "invalid signature" });
      return;
    }

    if (event !== "push") {
      send(res, 202, { ok: true, status: `ignored ${event}` });
      return;
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      send(res, 400, { ok: false, error: "invalid json" });
      return;
    }

    if (payload.ref !== `refs/heads/${branch}`) {
      send(res, 202, { ok: true, status: `ignored ${payload.ref}` });
      return;
    }

    runDeploy(res);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[${new Date().toISOString()}] angkasa webhook listening on 127.0.0.1:${port}`);
});
