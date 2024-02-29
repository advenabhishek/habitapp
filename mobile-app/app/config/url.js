//var host_name = 'http://172.18.208.1:4002/';
var host_name = 'https://api.thedoitapp.com/';
// var host_name = 'http://localhost:4002/';
//var host_name = 'http://192.168.29.49:4002/';
//var host_name = 'http://10.0.2.2:4002/'
//var host_name = 'http://127.0.0.1:4002/'

//var host_name = 'http://192.168.0.1:4002/';

module.exports = { 
  
  GET_HABIT_CATEGORY: host_name+'habit-category',
  GET_HABIT_BY_ID: host_name+'habit',
  GET_USER_HABIT_MAPPING_BY_USER: host_name+'user-habit/mapping/user',
  GET_HABIT_BY_HABIT_CATEGORY: host_name+'habit/habit-category',
  GET_ROUTINE_UNIT_BY_HABIT: host_name+'routine-unit/habit',
  POST_USER_HABIT: host_name+'user-habit',
  PUT_USER_HABIT: host_name+'user-habit',
  DELETE_USER_HABIT: host_name+'user-habit',
  GET_USER_HABIT_BY_USER: host_name+'user-habit/user',
  GET_USER_HABIT_BY_ID: host_name+'user-habit',
  POST_USER_HABIT_LOG: host_name+'user-habit-log',
  //GET_USER_HABIT_LOG_BY_USER: host_name+'user-habit-log/user',
  GET_USER_HABIT_LOG_SUMMARY: host_name+'user-habit-log/summary/user',
  GET_USER_LOG: host_name+'user-habit-log/user',
  DELETE_USER_LOG: host_name+'user-habit-log',
  PUT_USER_LOG: host_name+'user-habit-log',

  // GET_HABIT_CATEGORY: 'https://api.thedoitapp.com/habit-category',
  // GET_HABIT_BY_HABIT_CATEGORY: 'https://api.thedoitapp.com/habit/habit-category',
  // GET_ROUTINE_UNIT_BY_HABIT: 'https://api.thedoitapp.com/routine-unit/habit',
//   POST_USER_HABIT: 'https://api.thedoitapp.com/user-habit',
//   PUT_USER_HABIT: 'https://api.thedoitapp.com/user-habit',
//   DELETE_USER_HABIT: 'https://api.thedoitapp.com/user-habit',
//   GET_USER_HABIT_BY_USER: 'https://api.thedoitapp.com/user-habit/user',
//   POST_USER_HABIT_LOG: 'https://api.thedoitapp.com/user-habit-log',
// //  GET_USER_HABIT_LOG_BY_USER: 'https://api.thedoitapp.com/user-habit-log/user',
//   //GET_USER_HABIT_LOG_SUMMARY: 'https://api.thedoitapp.com/user-habit-log/summary/user',
//   GET_USER_HABIT_LOG_SUMMARY: 'https://api.thedoitapp.com/user-habit-log/user',
//   GET_USER_LOG: 'https://api.thedoitapp.com/user-habit-log/user',
  

  //GET_HABIT_CATEGORY: 'http://3.131.94.5:4002/habit-category',
  //GET_HABIT_BY_HABIT_CATEGORY: 'http://3.131.94.5:4002/habit/habit-category',
  //GET_ROUTINE_UNIT_BY_HABIT: 'http://3.131.94.5:4002/routine-unit/habit',
  //POST_USER_HABIT:'http://3.131.94.5:4002/routine-unit/habit',
}


// await axios.put(PUT_USER_HABIT+/userhabitid, {
//   selectedMetric, selectedFrequency, startDate: startTime (keep original startDate, but may change startTime: .sethour(), .setminutes()), location
// })

// await axios.delete(DELETE_USER_HABIT+/userhabitid)

// backtick ` {$URL} to put the userhabit
// axios npm : documentation of how to use
