var Pool = require('pg').Pool;

// postgres configuration
var config = {
	host    : '127.0.0.1',
	user    : 'postgres',
	password: 'shasin670621',
	database: 'postgres'
};

var User = module.exports = Pool(config);

module.exports.getUserById = function (userId, callback) {
	pool.query('SELECT * FROM "user" WHERE id=$1', [userId], function(err, result) {
		if (err) return err;
		else {
			if (result.rows.length === 0) {
				callback(404, null);
			} else {
				callback(null, result.rows[0]);
			}
		}
	});
};
