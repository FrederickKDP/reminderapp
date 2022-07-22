const passport = require("../middleware/passport");
let database = require("../database");

let remindersController = {
  list: (req, res) => {
    // Check if database exists, if not, create one for this user
    if(!(req.user.id in database)){
      console.log(`Database entry not found for ${req.user.id}. Creating one.`);

      database[req.user.id] = {reminders: []};
    }


    res.render("reminder/index", { reminders: database[req.user.id].reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database[req.user.id].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database[req.user.id].reminders });
    }
  },

  // Creates a new reminder
  // By default, express cannot to pull info from the post req
  create: (req, res) => {
    let reminder = {
      id: database[req.user.id].reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false
    };
    database[req.user.id].reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database[req.user.id].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implement this code
    const id = req.params.id;

    // Find and update info
    database[req.user.id].reminders.forEach((reminder) =>{
      if(reminder.id == id){
        reminder.title = req.body.title;
        reminder.description = req.body.description;
        reminder.completed = req.body.completed == "true" ? true : false;
        return true;
      }
    });

    //res.redirect("/reminders");
    res.redirect("/reminder/"+id);
    //res.redirect("reminders");
    //res.redirect('back');
    //res.render("reminder/edit", { reminderItem:true });
  },

  //TODO: Deleting will break the ID naming convention
  delete: (req, res) => {
    // Implement this code
    const id = database[req.user.id].reminders.findIndex((value) =>{
      return value.id == req.params.id;
    });
    if(id>=0){
      delete database[req.user.id].reminders[id];
    }
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
