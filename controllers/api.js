var _ = require('lodash');
exports.install = function() {

	F.cors('/api/*', ['get', 'post', 'put', 'delete'], true); 

    // `F.onAuthorize` will be called for each of the following routes
    F.route('/api/todos', getTodos, ['authorize']);
    F.route('/api/todos/{id}', getTodo, ['authorize']);
    F.route('/api/todos', addTodo, ['authorize', 'post']);
    F.route('/api/todos/{id}', updateTodo, ['authorize', 'put', ]);
    F.route('/api/todos/{id}', deleteTodo, ['authorize', 'delete']);

    //Not protected 
    F.route('/list', getList);


    //Let's add logging for each request so we know what's going on:
    F.on('request', function(req, res) {
        console.log(`[${req.method}] ${req.url}`);
    });

    F.route('#401', custom); // Unauthorized


};

function getList() {
    let self = this;
    self.json([1, 2, 3, 4, 5]);
}


let todoList = [{ 'id': UID(), 'text': 'position 1',isCompleted:false }, { 'id': UID(), 'text': 'position 2',isCompleted:false }, { 'id': UID(), 'text': 'position 3',isCompleted:false }];

function getTodos() {
    let self = this;
  //  console.log('getTodos ',todoList);
    self.json(todoList);
}

function getTodo(id) {
    let self = this;
    let todo =  _.find(todoList,{id:id});
    
        self.json(todo);
}

function addTodo() {
    var self = this;
    var todo = self.body;
     console.log(todo);
    todo.id=UID();
    todoList.push(todo);
  //  console.log(todoList);
     self.json({ 'operation': 'updateTodo', 'result': 'OK', data:todo });
}

function updateTodo(todo) {
    var self = this;
     var todo = self.body;
   //  console.log(todo);
      var match = _.find(todoList, {id:todo.id});
   
    if(match){
        var index = _.indexOf(todoList, _.find(todoList, {id:todo.id}));
        todoList.splice(index, 1, todo);
    } 
 console.log(todoList);
    self.json({ 'operation': 'updateTodo', 'result': 'OK',data:todo });
}

function deleteTodo(id) {
    var self = this;
  //   console.log('delete id=',id); 
     var match = _.find(todoList, {id:id});
 //    console.log('match=',match); 
    if(match){
        var index = _.indexOf(todoList, _.find(todoList, {id:id}));
 //       console.log('index=',index); 
        todoList.splice(index, 1);
        
    } 
 //  console.log(todoList); 
    self.json({ 'operation': 'deleteTodo', 'result': 'OK' });
}

function custom() {
    var self = this;
    self.json({ 'error': '401', 'message':'Unauthorized' });
}
