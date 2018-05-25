#! /usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { kebabCase, pick } = require('lodash')
require('./XTemplate/js/Ext.js');
require('./XTemplate/js/String.js');
require('./XTemplate/js/Format.js');
require('./XTemplate/js/Template.js');
require('./XTemplate/js/XTemplateParser.js');
require('./XTemplate/js/XTemplateCompiler.js');
require('./XTemplate/js/XTemplate.js');
var config = {}
var version

var List = require('prompt-list')
var Input = require('prompt-input')
var Confirm = require('prompt-confirm')

var util = require('./utils.js');

var answers = {
'useDefaults': null,
'appName': null,
'templateType': null,
'template': null,
'templateFolderName': null,
'packageName': null,
'version': null,
'description': null,
'gitRepositoryURL': null,
'keywords': null,
'author': null,
'license': null,
'bugsURL': null,
'homepageURL': null,
'createNow': null,
}

step00()

function step00() {
  var nodeDir = path.resolve(__dirname)
  var pkg = (fs.existsSync(nodeDir + '/package.json') && JSON.parse(fs.readFileSync(nodeDir + '/package.json', 'utf-8')) || {});
  version = pkg.version
  var data = fs.readFileSync(nodeDir + '/config.json')
  config = JSON.parse(data);
  console.log(chalk.bold.green(`\nSencha ExtGen ${version} (The Ext JS Project Generator for NPM)`))
  step01()
}

function step01() {
  new Confirm({
    message: 'Would you like to use defaults from config.json?',
    default: config.usedefaults
  }).run().then(answer => {
    answers['useDefaults'] = answer
    if(answers['useDefaults'] == true) {
      answers['appName'] = config.appName
      answers['templateType'] = config.templateType
      answers['template'] = config.template
      answers['templateFolderName'] = config.templateFolderName
      answers['packageName'] = config.packageName
      answers['version'] = config.version
      answers['description'] = config.description
      answers['gitRepositoryURL'] = config.gitRepositoryURL
      answers['keywords'] = config.keywords
      answers['author'] = config.author
      answers['license'] = config.license
      answers['bugsURL'] = config.bugsURL
      answers['homepageURL'] = config.homepageURL
      step99()
    }
    else {
      step02()
    }
  })
}

function step02() {
  new Input({
    message: 'What would you like to name your Ext JS app?',
    default:  config.appName
  }).run().then(answer => {
    answers['appName'] = answer
    step03()
  })
}

function step03() {
  new List({
    message: 'What type of Template do want?',
    choices: ['make a selection from a list','type a folder name'],
    default: 'make a selection from a list'
  }).run().then(answer => {
    answers['templateType'] = answer
    if(answers['templateType'] == 'make a selection from a list') {
      step04()
    }
    else {
      step05()
    }
  })
}

function step04() {
  new List({
    message: 'What Template would you like to use?',
    choices: ['universalmodern', 'moderndesktop', 'classicdesktop'],
    default: 'moderndesktop'
  }).run().then(answer => {
    answers['template'] = answer
    step06()
  })
}

function step05() {
  new Input({
    message: 'What is the Template folder name?',
    default:  config.templateFolderName
  }).run().then(answer => { 
    answers['templateFolderName'] = answer
    step06()
  })
}

function step06() {
  new Input({
    message: 'What would you like to name the NPM Package?',
    default:  kebabCase(answers['appName'])
  }).run().then(answer => { 
    answers['packageName'] = answer
    step07()
  })
}

function step07() {
  new Input({
    message: 'What NPM version is this?',
    default: config.version
  }).run().then(answer => { 
    answers['version'] = answer
    step08()
  })
}

function step08() {
  new Input({
    message: 'What is the description?',
    default: config.description
  }).run().then(answer => { 
    answers['description'] = answer
    step09()
  })
}


function step09() {
  new Input({
    message: 'What is the GIT repository URL?',
    default: config.gitRepositoryURL
  }).run().then(answer => { 
    answers['gitRepositoryURL'] = answer
    step10()
  })
}

function step10() {
  new Input({
    message: 'What are the NPM keywords?',
    default: config.keywords
  }).run().then(answer => { 
    answers['keywords'] = answer
    step11()
  })
}

function step11() {
  new Input({
    message: `What is the Author's Name?`,
    default: config.author
  }).run().then(answer => { 
    answers['author'] = answer
    step12()
  })
}

function step12() {
  new Input({
    message: 'What type of License does this project need?',
    default: config.license
  }).run().then(answer => { 
    answers['license'] = answer
    step13()
  })
}

function step13() {
  new Input({
    message: 'What is the URL to submit bugsURL?',
    default: config.bugsURL
  }).run().then(answer => { 
    answers['bugsURL'] = answer
    step14()
  })
}

function step14() {
  new Input({
    message: 'What is the Home Page URL?',
    default: config.homepageURL
  }).run().then(answer => { 
    answers['homepageURL'] = answer
    step99()
  })
}

function step99() {
  if (answers['template'] == null) {
    if (!fs.existsSync(answers['templateFolderName'])) {
      answers['template'] = 'folder'
      console.log('Error, Template folder does not exist - ' + answers['templateFolderName'])
      return
    }
  }

  new Confirm({
    message: 'Would you like to generate the Ext JS NPM project with above config now?',
    default: config.createNow
  }).run().then(answer => {
    answers['createNow'] = answer
    if (answers['createNow'] == true) {
      stepCreate()
    }
    else {
      console.log(`\n${chalk.red('Create has been cancelled')}\n`)
      return
    }
  })
}

async function stepCreate() {
  // for (var key in answers) { console.log(`${key} - ${answers[key]}`) }
  // var spawnPromise = require('./utils.js');

  var nodeDir = path.resolve(__dirname)
  var currDir = process.cwd()
  var destDir = currDir + '/' + answers['packageName']
  if (fs.existsSync(destDir)){
    console.log(`${chalk.red('Error: folder ' + destDir + ' exists')}`)
    //fs.removeSync(destDir)
    return
  }
  fs.mkdirSync(destDir);
  process.chdir(destDir)
  var values = {
    appName: answers['appName'],
    packageName: answers['packageName'],
    version: answers['version'],
    gitRepositoryURL: answers['gitRepositoryURL'],
    keywords: answers['keywords'],
    author: answers['author'],
    license: answers['license'],
    bugsURL: answers['bugsURL'],
    homepageURL: answers['homepageURL'],
    description: answers['description'],
  }
  var file = nodeDir + '/templates/package.json.tpl.default'
  var content = fs.readFileSync(file).toString()
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  tpl = null
  fs.writeFileSync(destDir + '/package.json', t);
  var file = nodeDir + '/templates/webpack.config.js.tpl.default'
  var content = fs.readFileSync(file).toString()
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  tpl = null
  fs.writeFileSync(destDir + '/webpack.config.js', t);

  var app = require('@extjs/ext-build/generate/app.js')
  console.log(currDir);
  var options = { 
    parms: [ 'gen', 'app', answers['appName'], './' ],
    //sdk: currDir + '/../node_modules/@extjs/ext',
    sdk: 'node_modules/@extjs/ext',
    template: answers['template'],
    templateFull: answers['templateFolderName'],
    force: false
  }
  new app(options)


  try {
    console.log(chalk.green('NPM install started...'));
    const substrings = ['[ERR]', '[WRN]', '[INF] Processing', "[INF] Server", "[INF] Writing content", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
    await util.spawnPromise('npm', ['install'], { stdio: 'inherit', encoding: 'utf-8', substrings });
    
    var frameworkPath = path.join(process.cwd(), 'node_modules', '@extjs', 'ext', 'package.json');
    var cmdPath = path.join(process.cwd(), 'node_modules', '@extjs', 'sencha-cmd', 'package.json');
    var senchaCfg = path.join(process.cwd(), '.sencha', 'app', 'sencha.cfg');

    var frameworkPkg = require(frameworkPath);
    var cmdPkg = require(cmdPath);

    fs.readFile(senchaCfg, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace('{cmdVer}', cmdPkg.version_full)
                        .replace('{frameVer}', frameworkPkg.sencha.version);

      fs.writeFileSync(senchaCfg, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });

    console.log(chalk.green('NPM install completed.'));
  }catch(err) {
    console.log(chalk.red('Error in NPM install: ' + err));
  }

  console.log(chalk.green('\nYour new Ext JS NPM project is ready!\n'))
  console.log(chalk.bold(`cd ${answers['packageName']} then "npm start" to run the development build and open your new application in a web browser.\n`))
}
