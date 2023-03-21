import React from "react"
import {
  DataTableColumn,
  createTablePlugin,
  usePlugin,
  useValue,
  DataTable,
  createState,
  PluginClient,
  Layout,
} from "flipper-plugin"
import { ObjectTree } from "./object-tree"

export type Row = {
  action: string
  payload: string
  updatedAt: string
}

const columns: DataTableColumn<Row>[] = [
  {
    key: "action",
    title: "Action",
    width: 200,
  },
  {
    key: "payload",
    title: "Payload",
    width: 200,
  },
  {
    key: "updatedAt",
    title: "Updated At",
    width: 150,
  },
]

type Events = {
  newRow: Row
  updateSnapshot: Record<any, any>
}

function plugin(client: PluginClient<Events, {}>) {
  const rows = createState<Record<string, Row>>({}, { persist: "rows" })

  const snapshot = createState<Record<any, any>>({}, { persist: "snapshot" })

  const selectedID = createState<string | null>(null, { persist: "selection" })

  // client.addMenuEntry(
  //   {
  //     label: 'Reset Selection',
  //     handler: () => {
  //       selectedID.set(null);
  //     },
  //   },
  //   {
  //     action: 'createPaste',
  //     handler: async () => {
  //       const selection = selectedID.get();
  //       if (selection) {
  //         await client.createPaste(
  //           JSON.stringify(rows.get()[selection], null, 2),
  //         );
  //       }
  //     },
  //   },
  // );

  client.onMessage("newRow", (row) => {
    rows.update((draft) => {
      draft[row.updatedAt] = row
    })
  })

  client.onMessage("updateSnapshot", (updatedSnapshot) => {
    snapshot.set(updatedSnapshot)
  })

  function setSelection(updatedAt: string) {
    selectedID.set("" + updatedAt)
  }

  return {
    rows,
    snapshot,
    selectedID,
    setSelection,
  }
}

function Component() {
  const instance = usePlugin(plugin)
  const rows = useValue(instance.rows)
  const selectedID = useValue(instance.selectedID)
  const snapshot = useValue(instance.snapshot)

  const rowsAsArray = Object.values(rows)

  return (
    <>
      <Layout.ScrollContainer vertical>
        <ObjectTree object={snapshot} />
      </Layout.ScrollContainer>
      <DataTable<Row> records={rowsAsArray} key="payload" columns={columns} />
    </>
  )
}

export { plugin, Component }
