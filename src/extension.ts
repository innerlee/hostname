// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem } from 'vscode'
import { hostname, type, platform, arch, release } from 'os'
const osName = require("os-name")
const getos = require('getos')
const promisify = require("promisify-node")

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "WordCount" is now active!')

    // create a new word counter
    let hostname = new Hostname()
    hostname.updateHostname()

    let disposable = commands.registerCommand('extension.Hostname', () => {
        hostname.updateHostname()
    })

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(hostname)
    context.subscriptions.push(disposable)
}

class Hostname {

    private _statusBarItem: StatusBarItem

    public async updateHostname() {

        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
        }

        let tooltip = [
            `hostname: ${hostname()}`,
            `type: ${type()}`,
            `platform: ${platform()}`,
            `arch: ${arch()}`,
            `release: ${release()}`,
            `os: ${osName()}`,
        ]

        if (platform() == 'linux') {
            const osAsync = promisify(getos)
            let osLinux = await osAsync().then((os) => {
                return os
            }).catch((error) => {
                console.log(error)
            })
            tooltip.push(`dist: ${osLinux.dist}`,
                `codename: ${osLinux.codename}`,
                `release: ${osLinux.release}`,
            )
        }

        // Update the status bar
        this._statusBarItem.text = hostname()
        this._statusBarItem.tooltip = tooltip.join('\n')
        this._statusBarItem.show()
    }

    dispose() {
        this._statusBarItem.dispose()
    }
}
