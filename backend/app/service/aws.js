var AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: 'AKIA54XEJ6VFIQOTVMV6',
    secretAccessKey: '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',
    region: 'ap-south-1',
    signatureVersion: 'v4'
})

const s3 = new AWS.S3({
    region: 'ap-south-1'
})

function getSignedUrl(key) {
    return 'https://doitappicons.s3.ap-south-1.amazonaws.com/' + key
    const url = s3.getSignedUrl('getObject', {
        Bucket: 'do-it-app',
        Key: key,
        Expires: 3600 * 24,
    })
    // console.log({ url })
    return url
}

module.exports = { getSignedUrl }

console.log(getSignedUrl('icons/Icon_addButton.png'))