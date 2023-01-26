const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  mode: "production",
  output: {
    uniqueName: "myFirstApp",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  // proxy: {
  //   '/micofrontend-shell.pacewisdom.in': {
  //     target: 'https://micofrontend-shell.pacewisdom.in/',
  //     secure: false,
  //   },
  // },
  headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: "module" },

      // For remotes (please adjust)
      name: "myFirstApp",
      filename: "remoteEntry.js",
      exposes: {
        './Module': './projects/my-first-app/src/app/manage-business-unit/manage-business-unit.module.ts',
      },


      // For hosts (please adjust)
      // remotes: {
      //     "shell": "http://localhost:5000/remoteEntry.js",

      // },

      shared: share({
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

        ...sharedMappings.getDescriptors()
      })

    }),
    sharedMappings.getPlugin()
  ],
};

// module.exports = withModuleFederationPlugin({

//   name: 'myFirstApp',

//   exposes: {
//     './Module': './projects/my-first-app/src/app/manage-business-unit/manage-business-unit.module.ts',
//   },

//   shared: {
//     ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
//   },

// });


