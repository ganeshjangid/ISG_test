const {CacheService} =require('./cahe_services');
//console.log(CacheService);

const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache=new CacheService(ttl);

const FeedModel = {

  getUserFeeds(userID) {
    const selectQuery = `SELECT * FROM feeds WHERE userID = ${userID}`;
    const key = `getUserFeeds_${userID}`;

    return cache.get(key, () => DB.then((connection) =>
      connection.query(selectQuery).then((rows) => {
        return rows;
      })
    )).then((result) => {
      return result;
    });
  },

  getFeedById(feedID) {
    const selectQuery = `SELECT * FROM feeds WHERE feedID = ${feedID}`;
    const key = `getFeedById_${feedID}`;

    return cache.get(key, () => DB.then((connection) =>
      connection.query(selectQuery).then((rows) => {
        return rows[0];
      })
    )).then((result) => {
      return result;
    });
  },

  countFeeds(userID) {
    const selectQuery = `SELECT COUNT(*) as count FROM feeds WHERE userID = ${userID}`;
    const key = `countFeeds_${userID}`;

    return cache.get(key, () => DB.then((connection) =>
      connection.query(selectQuery).then((rows) => {
        return rows[0].count;
      })
    )).then((result) => {
      return result;
    });
  },

  update(userID, feedID, feedData) {
    const whereQuery = `WHERE feedID = ${feedID} AND userID = ${userID}`;
    const updateQuery = `UPDATE feeds SET ? ${whereQuery}`;

    return DB.then((connection) => connection.query(updateQuery, feedData).then(() => {
      cache.del([`getFeedById_${feedID}`, `getUserFeeds_${userID}`]);
      return true;
    }));
  },

  delete(userID, feedID) {
    const deleteQuery = `DELETE from feeds WHERE userID = ${userID} AND feedID = ${feedID}`;
    return DB.then((connection) => connection.query(updateQuery, params).then(() => {
      cache.del([`countFeeds_${userID}`, `getFeedById_${feedID}`, `getUserFeeds_${userID}`]);
      return true;
    }));
  }
};

module.exports={
  FeedModel:FeedModel
}

