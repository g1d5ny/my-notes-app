const fs = require("fs")
const path = require("path")

// 프로젝트 이름 설정
const iosProjectName = "mynotesapp"
const koreanAppName = "폴더노트"

// iOS: xcscheme 수정
const xcschemePath = path.join(__dirname, `../ios/${iosProjectName}.xcodeproj/xcshareddata/xcschemes/${iosProjectName}.xcscheme`)
let xcschemeContent = fs.readFileSync(xcschemePath, "utf8")
xcschemeContent = xcschemeContent.replace(/BuildableName=".*?\.app"/g, `BuildableName="${iosProjectName}.app"`)
xcschemeContent = xcschemeContent.replace(/BlueprintName=".*?"/g, `BlueprintName="${iosProjectName}"`)
fs.writeFileSync(xcschemePath, xcschemeContent)

// iOS: Info.plist 수정
const iosPlistPath = path.join(__dirname, `../ios/${iosProjectName}/Info.plist`)
let plist = fs.readFileSync(iosPlistPath, "utf8")
plist = plist.replace(/<key>CFBundleDisplayName<\/key>\s*<string>.*?<\/string>/, `<key>CFBundleDisplayName</key>\n\t\t<string>${koreanAppName}</string>`)
fs.writeFileSync(iosPlistPath, plist)

// Android: strings.xml 수정
const androidStringsPath = path.join(__dirname, "../android/app/src/main/res/values/strings.xml")
let stringsXml = fs.readFileSync(androidStringsPath, "utf8")
stringsXml = stringsXml.replace(/<string name="app_name">.*?<\/string>/, `<string name="app_name">${koreanAppName}</string>`)
fs.writeFileSync(androidStringsPath, stringsXml)
