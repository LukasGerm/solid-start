// @refresh skip
// @ts-ignore
import type { Component } from "solid-js";
import { NoHydration, getRequestEvent, ssr } from "solid-js/web";
import { renderAsset } from "../renderAsset";
import type { DocumentComponentProps, PageEvent } from "../types";
import { ErrorBoundary } from "../../shared/ErrorBoundary";

const docType = ssr("<!DOCTYPE html>");

export function StartServer(props: { document: Component<DocumentComponentProps> }) {
  const context = getRequestEvent() as PageEvent;
  // @ts-ignore
  const nonce = context.nonce;
  return (
    <NoHydration>
      {docType as unknown as any}
      <ErrorBoundary>
        <props.document
          assets={<>{context.assets.map((m: any) => renderAsset(m))}</>}
          scripts={
            nonce ? (
              <>
                <script
                  nonce={nonce}
                  innerHTML={`window.manifest = ${JSON.stringify(context.manifest)}`}
                />
                <script
                  type="module"
                  src={
                    import.meta.env.MANIFEST["client"]!.inputs[
                      import.meta.env.MANIFEST["client"]!.handler
                    ]!.output.path
                  }
                />
              </>
            ) : (
              <>
                <script innerHTML={`window.manifest = ${JSON.stringify(context.manifest)}`} />
                <script
                  type="module"
                  src={
                    import.meta.env.MANIFEST["client"]!.inputs[
                      import.meta.env.MANIFEST["client"]!.handler
                    ]!.output.path
                  }
                />
              </>
            )
          }
        />
      </ErrorBoundary>
    </NoHydration>
  );
}
