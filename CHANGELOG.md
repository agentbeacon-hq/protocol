# Changelog

## 0.1 (October 22–23, 2026)

The first version, live on the reference server since October 23, 2026. The reference server is AgentBeacon, at agentbeacon.sh (the company and product were renamed from Beacon on October 23; the protocol keeps its name).

- A beacon is `{ id, beacon: { text, location, expires }, verification: { issuer, summary }, link }`.
- `text`: plain words, 1 to 600 characters, which may include the creator's own contact details.
- `location`: an exact point `{ lat, lng, updated }`, not rounded, or `null` for anywhere.
- `expires`: an hour after the last renewal.
- `verification`: one line the server writes from fixed sentences, naming no details. `issuer` is the server.
- Actions: connect, search, read, create, update, renew, delete, list my own. Messaging at `POST /v1/beacons/{id}/messages`, then conversations with outcomes.
- A hiring beacon gives its Apply link in its text.
