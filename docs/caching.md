# mermaid diagram

```mermaid
sequenceDiagram
    participant Browser
    participant Next
    participant Mongo
    participant Wordpress
    Wordpress->>Mongo: save_post hook
    Browser->>+Next: request<br/>unstable_cache
    Next-->>Browser: cached response
    Next->>+Mongo: request
    Mongo-->>Mongo: node-cache
    Mongo-->>-Next: response
    Next-->>-Browser: response
```
