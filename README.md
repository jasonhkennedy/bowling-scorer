# Bowling Scorer
A simple service to calculate the score of a bowling game from the number of pins knocked down in each roll.

## Description
The primary purpose of this interface is to provide a simple bowling scoring service. The service will return a JSON representation of the current game based on the data sent to it. Past rolls are encoded in the parameters of the URI and the next roll can be sent in the body. This structure allows the caller to get the game details of any combination of rolls. A link to the current game is also sent back in each response to aid the caller in continuing the game.

### Scoring
The rules used to score a bowling game can be found [here](http://bowling.about.com/od/rulesofthegame/a/bowlingscoring.htm). This particular service scores as the game progresses. As such, if there is a strike or a spare without the necessary next rolls to determine the frame value, the frame value will remain at 0 and the score will not be updated until those next rolls. For example, rolling a strike on the first roll will keep your score at 0 until the next two rolls are sent and calculated.

### Considerations
This was designed to be infinitely scalable. The server requires no persistent storage and the service itself can be spawned as many times as needed to handle the load of calculating scores. Games scores can be 'encoded' using a max of 21 characters, so the 'resource' in the API is just the rolls in the game. Each roll is one character for the number of pins knocked down (with 10 being represented as an 'X'). Game scores are simply recalculated during each call to the API and a self-referencing link is passed back each time. 

If the servers were CPU-bound, a caching system could be setup to retrieve games instead of recalculating. A simple start would be in-memory caching, although since the permutations of possible games is very high some sort of persistent storage would be wise. I decided to go with a non-storage implementation to allow easier scaling that doesn't depend on storage implementation.

### Dependencies
The server application is written in node.js and depends on 'express' and 'body-parser' that can be found in npm.

## API
### POST /v1/games/:rolls
#### Description
The call to add a roll to a game. The rolls parameter is optional and represents the previous rolls in a game. If the parameter is missing, it will represent a new game. Each roll is identified by one character (the number of pins knocked down) unless it was 10 and ‘X’ is used. The body must contain a "roll" sent as an integer representing the number of pins knocked down in the current roll.
#### New game request
    HTTP/1.1 POST /v1/games

    { "roll": 10 }
#### Add roll request
    HTTP/1.1 POST /v1/games/X

    { "roll": 5 }


### GET /v1/games/:rolls
#### Description
The call to get game details. The rolls parameter represents the previous rolls in a game. Each roll is identified by one character (the number of pins knocked down) unless it was 10 and ‘X’ is used.
#### Get game request
    HTTP/1.1 GET /v1/games/X737291XXX2364733

### Responses
Both the POST and GET will return the same style of responses captured below. Responses will be minified json, expanded here for clarity.
#### 200 OK
    {
      "score": 0,
      "frames": [
        {
          "num": 1,
          "roll1": "X",
          "roll2": "",
          "value": 0
        }
      ],
      "links": [
        {
          "rel": "self",
          "href": "/v1/games/X"
        }
      ]
    }
#### 400 Bad Request
    {
      "errorDetails": "Too many rolls"
    }

## Examples
### Start service:
    $ node index.js

### Start a new game:
    $ curl -i http://localhost:8081/v1/games -X POST -d '{"roll":10}' -H "Content-Type: application/json"
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 111
    ETag: W/"6f-APTcAdG+hTDdGWhQ1ZhEZA"
    Date: Tue, 24 May 2016 14:41:16 GMT
    Connection: keep-alive

    {"score":0,"frames":[{"num":1,"roll1":"X","roll2":"","value":0}],"links":[{"rel":"self","href":"/v1/games/X"}]}
    

### Continue a game:
    $ curl -i http://localhost:8081/v1/games/XXXXXXXXXXX -X POST -d '{"roll":10}' -H "Content-Type: application/json"
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 535
    ETag: W/"217-lSUtDTw5lNRXI1CVi4936w"
    Date: Tue, 24 May 2016 14:42:07 GMT
    Connection: keep-alive

    {"score":300,"frames":[{"num":1,"roll1":"X","roll2":"","value":30},{"num":2,"roll1":"X","roll2":"","value":30},{"num":3,"roll1":"X","roll2":"","value":30},{"num":4,"roll1":"X","roll2":"","value":30},{"num":5,"roll1":"X","roll2":"","value":30},{"num":6,"roll1":"X","roll2":"","value":30},{"num":7,"roll1":"X","roll2":"","value":30},{"num":8,"roll1":"X","roll2":"","value":30},{"num":9,"roll1":"X","roll2":"","value":30},{"num":10,"roll1":"X","roll2":"X","value":30,"roll3":"X"}],"links":[{"rel":"self","href":"/v1/games/XXXXXXXXXXXX"}]}

### Error:
    $ curl -i http://localhost:8081/v1/games/XXXXXXXXXXXX -X POST -d '{"roll":10}' -H "Content-Type: application/json"
    HTTP/1.1 400 Bad Request
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 33
    ETag: W/"21-/ojUZyHC/ChDubVsTYev5w"
    Date: Tue, 24 May 2016 15:06:44 GMT
    Connection: keep-alive

    {"errorDetails":"Too many rolls"}

test change
