// A one-shot handoff so a dashboard quick action can ask the destination
// screen to open its "create" modal on arrival. Set right before a client-side
// navigation and consumed once by the target screen's lazy initial state.
let pending: string | null = null;

export function requestCreate(key: string) {
  pending = key;
}

export function consumeCreate(key: string): boolean {
  if (pending === key) {
    pending = null;
    return true;
  }
  return false;
}
