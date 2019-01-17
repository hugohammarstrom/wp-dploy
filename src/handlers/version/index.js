import latestVersion from 'latest-version'
const version = require("../../../package.json").version

export default {
    hasUpdate: async () => {
        let latest = await latestVersion('@hugohammarstrom/wp-dploy');
        if (latest != version){
            return {
                version: latest,
                current: version
            }
        }
    }
}