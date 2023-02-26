import Button from "components/Button";
import { ApiKeyContext } from "contexts/ApiKeyContext";
import { EngineContext } from "contexts/EngineContext";
import { JobsContext } from "contexts/JobsContext";
import { restrictedKeys, SepanaRecord } from "models/sepana";
import React, { useContext, useEffect, useState } from "react";
import { deleteRecord, writeSepanaRecords } from "utils/api";
import { colorForType } from "utils/colors";

import EditableValue from "./EditableValue";

export default function Record({ record }: { record: SepanaRecord }) {
  const { addJobs } = useContext(JobsContext);
  const { engine } = useContext(EngineContext);
  const { apiKey } = useContext(ApiKeyContext);
  const [error, setError] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [editableObject, setEditableObject] = useState<SepanaRecord>(record);

  useEffect(() => {
    setEditableObject(
      Object.entries(record).reduce(
        (acc, [k, v]) => ({
          ...acc,
          ...(restrictedKeys.has(k) ? {} : { [k]: v }),
        }),
        {} as SepanaRecord
      )
    );
  }, [record]);

  async function updateRecord(newRecord: SepanaRecord) {
    if (!engine || !apiKey) return;

    let isValid = true;

    Object.keys(newRecord).forEach((k) => {
      const expectedType = typeof (record as Record<string, unknown>)[k];
      const actualType = typeof (newRecord as Record<string, unknown>)[k];

      if (
        expectedType !== actualType &&
        expectedType !== "undefined" &&
        expectedType !== "object"
      ) {
        isValid = false;
        setError(
          `Invalid type for property: ${k}. Expected: ${expectedType}. Actual: ${actualType}.`
        );
      }
    });

    if (!isValid) return;

    const res = await writeSepanaRecords({
      apiKey,
      engineId: engine.engine_id,
      records: [newRecord],
    });

    addJobs?.(res.jobs);

    setIsEditing(false);
  }

  async function _deleteRecord(recordId: string) {
    if (!engine || !apiKey) return;

    await deleteRecord({
      apiKey,
      engineId: engine.engine_id,
      recordId,
    });

    setConfirmDelete(false);
  }

  return (
    <div
      style={{
        background: "#ffffff12",
        display: "flex",
        flexDirection: "column",
        padding: 20,
        gap: 20,
        fontSize: ".84rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ flex: 1 }}>{record.id}</h3>
        {isEditing ? (
          <div style={{ display: "flex" }}>
            <Button
              onClick={() => {
                if (!editableObject) return;
                updateRecord(editableObject);
              }}
            >
              Update
            </Button>
            <Button
              kind="secondary"
              onClick={() => {
                setIsEditing(false);
                setError(undefined);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : confirmDelete ? (
          <div style={{ display: "flex", alignItems: "baseline" }}>
            You sure?
            <Button kind="danger" onClick={() => _deleteRecord(record._id)}>
              DELETE RECORD
            </Button>
            <Button kind="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex" }}>
            <Button
              size="small"
              kind="secondary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              size="small"
              kind="secondaryDanger"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {editableObject && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}
        >
          {Object.entries(editableObject).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  minWidth: 200,
                  opacity: 0.6,
                  fontWeight: 500,
                }}
              >
                {k}:
              </span>{" "}
              <EditableValue
                style={{ flex: 1 }}
                value={isEditing ? v : record[k as keyof typeof record]}
                isEditing={isEditing}
                onChange={(v) =>
                  setEditableObject((o) => ({
                    ...o,
                    [k]: v,
                  }))
                }
              />
              <span
                style={{
                  fontSize: ".65rem",
                  opacity: 0.6,
                  color: colorForType(record[k as keyof typeof record]),
                }}
              >
                {typeof record[k as keyof typeof record]}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          style={{
            display: "inline-block",
            color: "#F67429",
            background: "#F6742916",
            padding: 10,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
