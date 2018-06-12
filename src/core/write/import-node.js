'use strict'

const waterfall = require('async/waterfall')
const pull = require('pull-stream/pull')
const values = require('pull-stream/sources/values')
const collect = require('pull-stream/sinks/collect')
const importer = require('ipfs-unixfs-engine').importer
const {
  loadNode
} = require('../utils')

const importStream = (ipfs, source, options, callback) => {
  waterfall([
    (cb) => pull(
      values([{
        content: pull(source)
      }]),
      importer(ipfs._ipld, {
        progress: options.progress,
        hashAlg: options.hash,
        cidVersion: options.cidVersion,
        strategy: options.strategy,
        rawLeafNodes: options.rawLeafNodes,
        reduceSingleLeafToSelf: options.reduceSingleLeafToSelf
      }),
      collect(cb)
    ),
    (results, cb) => {
      return loadNode(ipfs, results[0], cb)
    }
  ], callback)
}

module.exports = importStream
