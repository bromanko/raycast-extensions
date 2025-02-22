import { showToast, Toast, List } from "@raycast/api";
import { useState } from "react";
import { useHAStates } from "../hooks";
import { useStateSearch, StateListItem } from "./states";

export function DoorsList(): JSX.Element {
  const [searchText, setSearchText] = useState<string>();
  const { states: allStates, error, isLoading } = useHAStates();
  const { states } = useStateSearch(searchText, "", "door", allStates);

  if (error) {
    showToast({
      style: Toast.Style.Failure,
      title: "Cannot fetch Home Assistant Doors",
      message: error.message,
    });
  }

  if (!states) {
    return <List isLoading={true} searchBarPlaceholder="Loading" />;
  }

  const updateRequiredStates = states.filter((s) => s.state === "on");
  const otherStates = states.filter((s) => s.state !== "on");

  return (
    <List searchBarPlaceholder="Filter by name or ID..." isLoading={isLoading} onSearchTextChange={setSearchText}>
      <List.Section title="Open Doors" subtitle={`${updateRequiredStates?.length}`}>
        {updateRequiredStates?.map((state) => <StateListItem key={state.entity_id} state={state} />)}
      </List.Section>
      <List.Section title="Closed Doors" subtitle={`${otherStates?.length}`}>
        {otherStates?.map((state) => <StateListItem key={state.entity_id} state={state} />)}
      </List.Section>
    </List>
  );
}
