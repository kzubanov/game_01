exports.levelWriter = function(num, data) {
    
    function levelName(num) {
        return 'level_' + num + '.js';
    }

    fs.writeFile( path.join(__dirname, 'src', 'levels', levelName(num)), data, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('файл level_' + num + '.js сохранен');
    });
}