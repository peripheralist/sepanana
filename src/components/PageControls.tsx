import React, { CSSProperties, useMemo } from "react";
import Button from "./Button";

export default function PageControls({
  recordsCount,
  pageSize,
  page,
  setPage,
}: {
  recordsCount: number | undefined;
  pageSize: number;
  page: number;
  setPage: (page: number) => void;
}) {
  const padButtonCount = 2;

  return useMemo(() => {
    if (!recordsCount) return null;

    const elems: JSX.Element[] = [];

    if (page > 1) {
      elems.push(
        <Button
          size="small"
          kind="secondary"
          key={0}
          onClick={() => setPage(page - 1)}
        >
          {"<"}
        </Button>
      );
    }

    if (page > 1 + padButtonCount) {
      elems.push(
        <Button
          size="small"
          kind="secondary"
          key={1}
          onClick={() => setPage(1)}
        >
          1
        </Button>
      );
      elems.push(<span key={8}>...</span>);
    }

    for (let i = padButtonCount; i >= 1; i--) {
      if (page > i) {
        elems.push(
          <Button
            size="small"
            kind="secondary"
            key={"leading" + i}
            onClick={() => setPage(page - i)}
          >
            {page - i}
          </Button>
        );
      }
    }

    elems.push(
      <Button
        size="small"
        kind="primary"
        disabled
        style={{ fontWeight: 700 }}
        key={"current"}
      >
        {page}
      </Button>
    );

    for (let i = 1; i <= padButtonCount; i++) {
      if (recordsCount > pageSize * page) {
        elems.push(
          <Button
            size="small"
            kind="secondary"
            key={"trailing" + i}
            onClick={() => setPage(page + i)}
          >
            {page + i}
          </Button>
        );
      }
    }

    if (recordsCount > pageSize * (page + 3)) {
      elems.push(<span key={8}>...</span>);
      elems.push(
        <Button
          size="small"
          kind="secondary"
          key={9}
          onClick={() => setPage(Math.ceil(recordsCount / pageSize) - 1)}
        >
          {Math.ceil(recordsCount / pageSize)}
        </Button>
      );
    }

    if (recordsCount > pageSize * (page + 1)) {
      elems.push(
        <Button
          size="small"
          kind="secondary"
          key={10}
          onClick={() => setPage(page + 1)}
        >
          {">"}
        </Button>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "baseline" }}>{elems}</div>
    );
  }, [page, recordsCount, pageSize, setPage]);
}
