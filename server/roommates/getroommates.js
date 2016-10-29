/* Implemented by: Chris */
/*
  GET /household/roommates?token=X(&userId=Y)

  Returns the current user's roommates.

  If you supply a userId, will return only that user.
*/

var User = require('../models/user.js');
var jwtDecode = require('jwt-decode');
var Household = require('../models/household.js');
var utilities = require('../utilities.js');

module.exports = function(req, res) {
  var token = req.query.token;
  var decoded = jwtDecode(token);
  var currentUserId = decoded.id;
  var householdId = decoded.householdId;
  var userId = req.query.userId;

  Household.findOne({ '_id': householdId }, function(err, hh) {
    if (err) {
      throw err;
    }
    if (hh) {
      if (userId) {
        var users = hh.HouseholdMembers.map(function(v, i, a) {
          return {
            displayName: v.displayName,
            id: v._id,
            admin: v.admin
          }
        });
        res.json({
          success: true,
          roommates: users
        });
      }
      else {
        var userIndex = hh.HouseholdMembers.indexOf(userId);
        if (userIndex == -1) {
          res.json({
            success: false,
            message: "User not found in household."
          });
        }
        else {
          var user = {
            displayName: hh.HouseholdMembers[userIndex].displayName,
            id: hh.HouseholdMembers[userIndex]._id,
            admin: hh.HouseholdMembers[userIndex].admin
          };
          res.json({
            success: true,
            roommate: user
          });
        }
      }
    }
    else {
      res.json({
        success: false,
        message: "Current user's household wasn't found."
      });
    }
  });
}