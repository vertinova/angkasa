import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureBoard({
  title,
  description,
  features
}: {
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="space-y-5">
      <div>
        <Badge>module</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">{title}</h1>
        <p className="mt-1 max-w-3xl text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature}>
            <CardHeader>
              <CardTitle className="text-base">{feature}</CardTitle>
              <CardDescription>Endpoint, permission, audit log, dan UI state mengikuti arsitektur modular.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 w-2/3 rounded-full bg-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
