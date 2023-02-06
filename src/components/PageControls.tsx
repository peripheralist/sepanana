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
  return useMemo(() => {
    if (!recordsCount) return null;

    const elems: JSX.Element[] = [];

    if (page > 0) {
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

    if (page > 2) {
      elems.push(
        <Button
          size="small"
          kind="secondary"
          key={1}
          onClick={() => setPage(0)}
        >
          1
        </Button>
      );
      elems.push(<span key={2}>...</span>);
    }

    for (let i = 1; i >= 0; i--) {
      if (page > i) {
        elems.push(
          <Button
            size="small"
            kind="secondary"
            key={3 + i}
            onClick={() => setPage(page - (i + 1))}
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
        key={5}
      >
        {page + 1}
      </Button>
    );

    for (let i = 1; i <= 2; i++) {
      if (recordsCount > pageSize * (page + i)) {
        elems.push(
          <Button
            size="small"
            kind="secondary"
            key={5 + i}
            onClick={() => setPage(page + i)}
          >
            {page + 1 + i}
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
