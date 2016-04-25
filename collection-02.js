// Declare a collection in the Mongo database
var Signups = new Mongo.Collection("signups");

//This code executes only on the client
if (Meteor.isClient) {

  Session.setDefault('submitting', false);

  Template.body.helpers({
    
    // The signups helper returns a list of the signups.
    // Find all the signups in the database and return them.
    signups: function() {
        return Signups.find({}, {sort: {dateCreated: -1}}); 
    },
    
    submitting: function() {
      return Session.get('submitting');
    }
    
  });
  
  Template.new_entry_button.events({
    "click .new_entry_button": function(event) {
      Session.set('submitting', true);
    }
  })
  
    Template.cancel_entry_button.events({
    "click .cancel_entry_button": function(event) {
      Session.set('submitting', false);
    }
  })
  
  
Template.signup.helpers({
  
      highlight_selector: function() {
      if (Session.get("latest_selector") == this.selector) {
        return "<strong>" + this.selector + "</strong>";
      }
      else {
        return this.selector;
      }
    }
    
  });

  Template.signup.events({

    // When a user clicks on an element, highlight this sentence and any other containing the same element
    "click .signup span": function(event) {
      
      var field = $(event.target).data('field');
      var val = $(event.target).data('val');
      console.log(field, val);
      
      // Remove active class from everything
      $('.signup').removeClass('matched-name').
        removeClass('matched-selector').
        removeClass('matched-fail').
        removeClass('matched-punctuation');
      
      // Find spans that have the same field and val as this one
      var spans = $('[data-field=' + field + '][data-val="' + val + '"]').addClass('active');
      
      // For each one, add the active class to its parent sentence
      spans.each(function() {
        var sentence = $(this).closest('.signup');
        sentence.addClass('matched-' + field);
      });
      
    }
    
    
    // // This function is called whenever there is a click
    // // event on a delete link in the "signup" template
    // "click .delete": function(event) {
      
    //   // Tell the browser not to do its default behavior 
    //   // (which would try to link somewhere)
    //   event.preventDefault();

    //   // Using the Mongo id of this template's object, tell Mongo
    //   // to remove the object from the database
    //   Signups.remove(this._id);
    // }
    
  });
  
  Template.new.events({
    
        // This function is called whenever there is a submit
    // event in the "new" template
    "submit": function(event) {
      
      // Tell the browser not to do its default behavior 
      // (which would reload the page)
      event.preventDefault();
      
      // Get the <form> HTML element (which by definition is
      // the target of the submit event)
      var form = event.target;
    
  
      // Insert a signup into the database collection
      Signups.insert({
        name: form.name.value,
        selector: form.selector.value,
        fail: form.fail.value,
        punctuation: form.punctuation.value,
        dateCreated: new Date()
      });


      // Clear the text fields
      form.name.value = '';
      form.selector.value = '';
      form.fail.value = '';
      form.punctuation.value = '';

      // Focus the name field
      form.name.focus();
      
      
      Session.set('submitting', false);
      
    }
  });
  
}