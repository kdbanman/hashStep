hashStep
========

Testing phase project #2 for [gameruum](gameruum.io)

# TODO

<!-- -->

- document intended use case step by step

<!-- -->

- `/reset/<int>` starts room waiting for <int> clients

<!-- -->

- serve seeded app on `room.state` for `?seed=<int>&size=<int>`
    - seed or size is 42 if not provided
    - if connection is attempted ('ready' is pressed) with bad seed or size, then room's bad seed use case is activated

<!-- -->

- write `room` library that models basic `gameroom` interface
    - ready button handshakes with room server

<!-- -->

- write handlebars client template
    - client <id>
        - status: <state>
        - latency: <ms>

<!-- -->

- write handlebars hashcode template
    - <hash name>: <hashcode || blank>

<!-- -->

- include stable-stringify and string hashing methods
    - https://github.com/substack/json-stable-stringify
    - https://github.com/Caligatio/jsSHA
    - https://github.com/h2non/jshashes

<!-- -->

- test on localhost with multiple browsers

<!-- -->

- run on AWS instance

<!-- -->

- point stateHash.gameruum.io and hashStep.gameruum.io correctly on nginx

# about

hashStep is a two page client-server application using a mersenne twister and socket.io to test cross-browser, realtime synchronization.

The server can be in one of two master states, `open` or `closed`.
An `open` server serves the main application page with a seed for each client's random object generator.
A `closed` server serves a page indicating that the server is full and/or running.

The main application page connects with the server's socket.io instance.
Several clients (running the main application page) connect, and when they all declare `ready`, the server transitions to `closed`.

Once the server is `closed`, the first server packet is sent.
The intended behaviour is for connected clients to synchronously generate the same random object step-by-step until 200 root fields exist, or until desynchronization as indicated by any of the hash algorithms.

## server packets

Each packet structure is listed below according to its corresponding event.

### `next`
    
Each `next` triggers one creation/hash step.
One creation step is an empty object, an empty array, or a primitive value appended to either of the former.

     {generation: <integer>}    // the current step in object generation

### `desynchronization`

Desync occurs when there is not consensus across all clients about the current hash value of the object being generated.

    {generation: <integer>,     // the desynchronized generation.
     hashes_djb2: [<integer>,   // each hashes_* is an array of the hashcodes
                   <integer>,   // as reported by each client.
                   ...
                   <integer>],
     hashes_sdbm: [...],
     hashes_javaHashCode: [...],
     hashes_crc32: [...]}

### `error`

An error is thrown when something unaccounted-for happens.

    {<unspecified>}

## client packet

### `handshake`

The handshake is sent upon connection to verify that seeds are the same across each client.

    {seed: <integer>}

### `report`

The report is sent after each round of object generation and hashing.

    {generation: <integer>      // the current generation step
     hash_djb2: <integer>,
     hash_sdbm: <integer>,
     hash_javaHashCode: <integer>,
     hash_crc32: <integer>}

### `error`

Errors are thrown when something unaccounted for happens.

    {<unspecified>}

# learned

- es6
    - generators
    - traceur
