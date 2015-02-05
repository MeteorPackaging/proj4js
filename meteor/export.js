/*global proj4:true*/  // Meteor creates a file-scope global for exporting. This comment prevents a potential JSHint warning.
proj4 = this.proj4;
delete this.proj4;