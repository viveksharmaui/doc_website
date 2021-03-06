// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React, { useMemo, memo } from "react";
import { DocsData, FlattendProvider } from "../util/data";
import {
  groupNodes,
  DocNodeShared,
  ParamDef,
  TsTypeDef,
  DocNodeLocation,
  sortByAlphabet,
  DocNode,
  expandNamespaces,
  flattenNamespaces,
} from "../util/docs";
import { JSDoc } from "./JSDoc";
import { ClassCard } from "./Class";
import { TsType } from "./TsType";
import { FunctionCard } from "./Function";
import { EnumCard } from "./Enum";
import { InterfaceCard } from "./Interface";
import { VariableCard } from "./Variable";
import { TypeAliasCard } from "./TypeAlias";
import { Page } from "./Page";
import { NamespaceCard } from "./Namespace";

export const SinglePage = memo(
  (props: {
    forceReload: () => void;
    entrypoint: string;
    data: DocsData | undefined;
  }) => {
    const nodes = useMemo(() => expandNamespaces(props.data?.nodes ?? []), [
      props.data?.nodes,
    ]);

    if (!props.data) {
      return (
        <Page
          forceReload={props.forceReload}
          entrypoint={props.entrypoint}
          timestamp=""
        >
          <div className="max-w-4xl px-4 pb-3 bg-gray-100 sm:px-6">
            <div className="py-4">
              <div className="mb-1 text-2xl font-medium text-gray-900">
                Loading...
              </div>
              <div className="text-lg text-gray-900">
                It can take a few seconds for documentation to be generated.
              </div>
            </div>
          </div>
        </Page>
      );
    }

    const hasNone = nodes.length === 0;

    const flattend = flattenNamespaces(nodes);

    return (
      <FlattendProvider value={flattend}>
        <Page
          forceReload={props.forceReload}
          entrypoint={props.entrypoint}
          timestamp={props.data.timestamp}
        >
          <div className="max-w-4xl px-4 pb-3 bg-gray-100 sm:px-6">
            {hasNone ? (
              <div className="py-4">
                <div className="mb-1 text-xl text-gray-900">
                  This module has no exports that are recognized by deno doc.
                </div>
              </div>
            ) : null}
            <div className="pb-4">
              <CardList nodes={nodes} />
            </div>
          </div>
        </Page>
      </FlattendProvider>
    );
  }
);

export const CardList = memo(
  ({ nodes, nested }: { nodes: DocNode[]; nested?: boolean }) => {
    const groups = useMemo(() => groupNodes(sortByAlphabet(nodes)), [nodes]);

    return (
      <>
        {groups.functions.length > 0 ? (
          <div>
            <div
              className={
                "text-gray-900 font-medium mb-1 " +
                (nested ? "text-md mt-2" : "text-2xl mt-4")
              }
            >
              Functions
            </div>
            <div>
              {groups.functions.map((node, i) => (
                <FunctionCard
                  node={node}
                  nested={!!nested}
                  key={`$${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.variables.length > 0 ? (
          <div>
            <div
              className={
                "text-gray-900 font-medium mb-1 " +
                (nested ? "text-md mt-2" : "text-2xl mt-4")
              }
            >
              Variables
            </div>
            <div>
              {groups.variables.map((node, i) => (
                <VariableCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.classes.length > 0 ? (
          <div>
            <div
              className={
                "text-gray-900 font-medium mb-1 " +
                (nested ? "text-md mt-2" : "text-2xl mt-4")
              }
            >
              Classes
            </div>
            <div>
              {groups.classes.map((node, i) => (
                <ClassCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div>
            <div
              className={
                "text-gray-900 font-medium mb-1 " +
                (nested ? "text-md mt-2" : "text-2xl mt-4")
              }
            >
              Enums
            </div>
            <div>
              {groups.enums.map((node, i) => (
                <EnumCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.interfaces.length > 0 ? (
          <div>
            <div
              className={
                "text-gray-900 font-medium mb-1 " +
                (nested ? "text-md mt-2" : "text-2xl mt-4")
              }
            >
              Interfaces
            </div>
            <div>
              {groups.interfaces.map((node, i) => (
                <InterfaceCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.typeAliases.length > 0 ? (
          <div>
            <div
              className={
                "text-gray-900 font-medium mb-1 " +
                (nested ? "text-md mt-2" : "text-2xl mt-4")
              }
            >
              Type Aliases
            </div>
            <div>
              {groups.typeAliases.map((node, i) => (
                <TypeAliasCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.namespaces.length > 0 ? (
          <div>
            <div
              className={
                "text-gray-900 font-medium mb-1 " +
                (nested ? "text-md mt-2" : "text-2xl mt-4")
              }
            >
              Namespaces
            </div>
            <div>
              {groups.namespaces.map((node, i) => (
                <NamespaceCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </>
    );
  }
);

export function SimpleCard({
  node,
  prefix,
  details,
  suffix,
  params,
  returnType,
  nested,
}: {
  node: DocNodeShared & { kind?: string };
  prefix?: string;
  details?: React.ReactNode;
  suffix?: React.ReactNode;
  params?: ParamDef[];
  returnType?: TsTypeDef;
  nested: boolean;
}) {
  const paramElements = [];
  if (params) {
    for (const p of params) {
      paramElements.push(
        <>
          {p.name}
          {p.tsType ? (
            <>
              : <TsType tsType={p.tsType} scope={node.scope ?? []} />
            </>
          ) : null}
        </>,
        ", "
      );
    }
    paramElements.pop();
  }
  const id = (node.scope ?? []).concat(node.name).join(".");
  return (
    <div
      className={
        "mt-2 p-2 bg-white " +
        (nested ? "rounded border border-gray-300" : "rounded-md shadow")
      }
      id={id}
    >
      <div className="font-mono text-lg break-words">
        {prefix ? <span className="keyword">{prefix} </span> : null}
        {node.scope?.map((s, i) => (
          <>
            <a
              href={"#" + node.scope?.slice(0, i + 1).join(".")}
              className="pointer hover:underline"
            >
              {s}
            </a>
            .
          </>
        ))}
        <a href={"#" + id} className="pointer hover:underline">
          <span className="font-bold">{node.name}</span>
        </a>
        {params ? (
          <span className="text-gray-600">({paramElements})</span>
        ) : null}
        {returnType ? (
          <span className="text-gray-600 ">
            {" ⇒ "}
            <TsType tsType={returnType} scope={node.scope ?? []} />
          </span>
        ) : null}
        {suffix}
      </div>

      <div className="mt-1 text-xs text-gray-600">
        Defined in file '
        <a
          href={node.location.filename}
          className="break-words hover:text-gray-800"
        >
          {node.location.filename}
        </a>
        ' on line {node.location.line}, column {node.location.col}.
      </div>

      {node.jsDoc ? (
        <div className="mt-2 text-xs">
          <JSDoc jsdoc={node.jsDoc} />
        </div>
      ) : null}

      {details}
    </div>
  );
}

export function SimpleSubCard({
  node,
  prefix,
  params,
  returnType,
}: {
  node: Omit<DocNodeShared, "location"> & {
    kind?: string;
    location?: DocNodeLocation;
    inherited?: boolean;
  };
  prefix?: string;
  params?: ParamDef[];
  returnType?: TsTypeDef;
}) {
  const paramElements = [];
  if (params) {
    for (const p of params) {
      paramElements.push(
        <>
          {p.name}
          {p.tsType ? (
            <>
              : <TsType tsType={p.tsType} scope={node.scope ?? []} />
            </>
          ) : null}
        </>,
        ", "
      );
    }
    paramElements.pop();
  }

  return (
    <div className="px-2 py-1 mt-2 bg-gray-100 rounded">
      <div
        className={
          "font-mono text-sm break-words" +
          (node.inherited ? " italic opacity-50" : "")
        }
      >
        {node.inherited ? (
          <span className="text-gray-600">inherited </span>
        ) : null}
        {prefix ? <span className="keyword">{prefix} </span> : null}
        <>{node.name}</>
        {params ? (
          <span className="text-gray-600">({paramElements})</span>
        ) : null}
        {returnType ? (
          <span className="text-gray-600">
            {" → "}
            <TsType tsType={returnType} scope={node.scope ?? []} />
          </span>
        ) : null}
      </div>
      {node.jsDoc ? (
        <div className="mt-1 text-xs">
          <JSDoc jsdoc={node.jsDoc} />
        </div>
      ) : null}
      {node.location ? (
        <div className="mt-1 text-xs text-gray-600">
          Defined in file '
          <a
            href={node.location.filename}
            className="break-words hover:text-gray-800"
          >
            {node.location.filename}
          </a>
          ' on line {node.location.line}, column {node.location.col}.
        </div>
      ) : null}
    </div>
  );
}
