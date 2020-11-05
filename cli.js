#!/usr/bin/env node

//特定文件头  mac修改权限755   chmode 755 cli.js
//工作过程
//1.通过命令行交互询问用户问题
//2.通过回答结果根绝模板生成文件

const inquirer = require('inquirer')

const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

const promptList = [{
    type: 'list',
    message: '请选择要创建的文件类型:',
    name: 'fileType',
    choices: [
        "vue",
    ],
    filter: function (val) { // 使用filter将回答变为小写
        return val.toLowerCase();
    }
  },{
    type: 'input',
    name: 'fileName',
    message: '文件名称'
  },{
    type: 'input',
    name: 'saveDir',
    message: '文件存储路径'
}];

inquirer.prompt(promptList).then(anwsers => {
  console.log(anwsers)
  //模板目录
  const tempDir = path.join(__dirname, 'templates')
  //目标目录
  const destDir = process.cwd() + '/' + anwsers.saveDir;

  fs.readdir(tempDir, (err, files) => {
    if (anwsers.fileType === 'vue') {
      const fileName = anwsers.fileName + '.vue'
      ejs.renderFile(path.join(tempDir, 'vue/base.vue'), anwsers, (err, result) => {
        fs.access(path.join(destDir, fileName), (err) => {
          if (err) {
            if (err.code === 'ENOENT') {
              console.log('不存在')
               //不存在创建文件夹
              fs.mkdir(path.join(destDir), { recursive: true }, (error) => {
                if (error) throw error
                //创建成功后写入文件
                fs.writeFileSync(path.join(destDir, fileName), result)
              })
            }
            return 
          }
          //存在文件则不写入
          console.log('已存在该文件，不可写入')
        });
      });
    }
  })
})