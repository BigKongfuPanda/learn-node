const EventEmitter = require('events');
const fs = require('fs');

class Watcher extends EventEmitter {
    constructor(watchDir, processedDir){
        super();
        this.watchDir = watchDir;
        this.processedDir = processedDir;
    }
    watch () {
        fs.readdir(this.watchDir, (err, files) => {
            if (err) {
               throw err; 
            }
            for (const index in files) {
                this.emit('process', files[index]);
            }
        });
    }
    process () {
        this.on('process', (file) => {
            let watchFile = this.watchDir + '/' + file;
            let processedFile = this.processedDir + '/' + file;
            fs.rename(watchFile, processedFile, (err) => {
                if(err) throw err;
            });
        });
    }
    start () {
        this.process();
        fs.watchFile (watchDir, () => {
            this.watch();
        });
    }
}

const watcher = new Watcher('./watch', './done');
watcher.start();