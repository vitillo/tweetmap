function TweetStore(){
  this.tweets = [];
  this.coords = new Float32Array(1000);
}

TweetStore.MAX_SIZE = 1000;

TweetStore.prototype = {
  add: function(text, lng, lat){
    this.tweets.push({text: text});

  },

  get: function(id){
    return this.tweets[id];
  }
}
