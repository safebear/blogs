import http from "k6/http";
import { sleep } from "k6";

// Configuration for K6
export let options = {
  // 10 virtual users
  vus: 10,
  // duration
  duration: "30s",

  // This is for ramping up and ramping down using 'stages'
  // Target is the number of VUs - can't be used with the 'vus' option above
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m30s", target: 10  },
    { duration: "20s", target: 0 },
  ]

};

// Set a counter - this will be unique to each VU
var counter = 0;

// This is what is executed for each virtual user
export default function() {

  // request
  http.get("http://test.loadimpact.com");
  
  // This is how we pause
  sleep(1);

  // This is how we make checks
  // I guess 'res' is the response object
  // While the second object is a set of functions that are pre-built checks? (where are these listed?)
  check(res, {
    "status was 200": (r) => r.status == 200,
    "transaction time OK": (r) => r.timings.duration < 200
  });

  // This will increment uniquely for each VU.
  counter++

  // You can aggregate data from dynamic URLs by explicitly setting a name tag:
  for (var id = 1; id <= 100; id++) {
  http.get(`http://example.com/posts/${id}`, {tags: {name: 'PostsItemURL'}})
  }

  // tags.name="PostsItemURL",
  // tags.name="PostsItemURL",
};