// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'pact'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('@pact-foundation/karma-pact'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      failSpecWithNoExpectations: false,
      jasmine: {
        timeoutInterval: 10000
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/Pact-With-Angular'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome_without_security'],
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },
    singleRun: false,
    restartOnFileChange: true,
    pact: [{
      cors: true,
      port: 1234,
      consumer: "ui",
      provider: "userDataService",
      dir: "pact",
      spec: 2
    }],
    proxies: {
      '/user-service/': 'http://127.0.0.1:1234/user-service/'
    }
  });
};
