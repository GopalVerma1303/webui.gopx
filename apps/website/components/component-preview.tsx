"use client";

import * as React from "react";
import { Tabs } from "nextra/components";
import { Icons } from "@/components/magicui-icons";
import { ComponentName, registry } from "@/registry/index";
import { Pre } from "./pre";
import Showcase from "./Showcase3";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: ComponentName;
  align?: "center" | "start" | "end";
  preview?: boolean;
}

interface ComponentData {
  name: string;
  registryDependencies: string[];
  files: { name: string; content: string }[];
  type: string;
}

export function ComponentPreview({
  name,
  className,
  align = "center",
  preview = false,
  ...props
}: ComponentPreviewProps) {
  const [sourceCode, setSourceCode] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [key, setKey] = React.useState(0);
  const [isPending, startTransition] = React.useTransition();

  const Component = registry[name]?.component;

  React.useEffect(() => {
    const fetchSourceCode = async () => {
      try {
        const indexResponse = await fetch("/registry/index.json");
        const indexData = await indexResponse.json();
        const componentInfo = indexData.find((item: any) => item.name === name);
        if (!componentInfo) {
          throw new Error(`Component "${name}" not found in registry index.`);
        }

        let componentPath;
        switch (componentInfo.type) {
          case "components:ui":
            componentPath = `/registry/components/ui/${name}.json`;
            break;
          case "components:example":
            componentPath = `/registry/components/example/${name}.json`;
            break;
          case "components:block":
            componentPath = `/registry/components/block/${name}.json`;
            break;
          default:
            throw new Error(`Unknown component type: ${componentInfo.type}`);
        }

        const componentResponse = await fetch(componentPath);
        const data: ComponentData = await componentResponse.json();
        setSourceCode(data.files[0]?.content || "");
      } catch (err) {
        console.error("Error fetching component data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      }
    };

    startTransition(() => {
      fetchSourceCode();
    });
  }, [name]);

  const Preview = React.useMemo(() => {
    if (!Component) {
      console.error(`Component with name "${name}" not found in registry.`);
      return (
        <p className="text-sm text-muted-foreground">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      );
    }
    return <Component />;
  }, [name, Component]);

  const handleReload = React.useCallback(() => {
    startTransition(() => {
      setKey((prev) => prev + 1);
    });
  }, []);

  return (
    <Tabs items={["Preview", "Code"]}>
      <Tabs.Tab>
        <Showcase>
          <React.Suspense
            fallback={
              <div className="flex items-center text-sm text-muted-foreground">
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                Loading...
              </div>
            }
          >
            {React.createElement(React.Fragment, { key }, Preview)}
          </React.Suspense>
        </Showcase>
      </Tabs.Tab>
      <Tabs.Tab>
        <Pre filename={`${name}.tsx`} hasCopyCode>
          {sourceCode}
        </Pre>
      </Tabs.Tab>
    </Tabs>
  );
}
