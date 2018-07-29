$(document).ready(function(){
    $('#btn').click(function() {
        $.post('/users?name=z中文&id=121212', {age: 12, location: 'bj北京'}, (data) => {
            console.log(data);
        });
    });
});
