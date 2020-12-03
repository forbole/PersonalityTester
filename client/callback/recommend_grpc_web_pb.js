/**
 * @fileoverview gRPC-Web generated client stub for routeguide
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.routeguide = require('./recommend_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.routeguide.RouteGuideClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.routeguide.RouteGuidePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.routeguide.Datastream,
 *   !proto.routeguide.msg>}
 */
const methodDescriptor_RouteGuide_SaveData = new grpc.web.MethodDescriptor(
  '/routeguide.RouteGuide/SaveData',
  grpc.web.MethodType.UNARY,
  proto.routeguide.Datastream,
  proto.routeguide.msg,
  /**
   * @param {!proto.routeguide.Datastream} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.routeguide.msg.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.routeguide.Datastream,
 *   !proto.routeguide.msg>}
 */
const methodInfo_RouteGuide_SaveData = new grpc.web.AbstractClientBase.MethodInfo(
  proto.routeguide.msg,
  /**
   * @param {!proto.routeguide.Datastream} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.routeguide.msg.deserializeBinary
);


/**
 * @param {!proto.routeguide.Datastream} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.routeguide.msg)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.routeguide.msg>|undefined}
 *     The XHR Node Readable Stream
 */
proto.routeguide.RouteGuideClient.prototype.saveData =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/routeguide.RouteGuide/SaveData',
      request,
      metadata || {},
      methodDescriptor_RouteGuide_SaveData,
      callback);
};


/**
 * @param {!proto.routeguide.Datastream} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.routeguide.msg>}
 *     Promise that resolves to the response
 */
proto.routeguide.RouteGuidePromiseClient.prototype.saveData =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/routeguide.RouteGuide/SaveData',
      request,
      metadata || {},
      methodDescriptor_RouteGuide_SaveData);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.routeguide.UserInfo,
 *   !proto.routeguide.Words>}
 */
const methodDescriptor_RouteGuide_GetRecommended = new grpc.web.MethodDescriptor(
  '/routeguide.RouteGuide/GetRecommended',
  grpc.web.MethodType.UNARY,
  proto.routeguide.UserInfo,
  proto.routeguide.Words,
  /**
   * @param {!proto.routeguide.UserInfo} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.routeguide.Words.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.routeguide.UserInfo,
 *   !proto.routeguide.Words>}
 */
const methodInfo_RouteGuide_GetRecommended = new grpc.web.AbstractClientBase.MethodInfo(
  proto.routeguide.Words,
  /**
   * @param {!proto.routeguide.UserInfo} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.routeguide.Words.deserializeBinary
);


/**
 * @param {!proto.routeguide.UserInfo} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.routeguide.Words)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.routeguide.Words>|undefined}
 *     The XHR Node Readable Stream
 */
proto.routeguide.RouteGuideClient.prototype.getRecommended =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/routeguide.RouteGuide/GetRecommended',
      request,
      metadata || {},
      methodDescriptor_RouteGuide_GetRecommended,
      callback);
};


/**
 * @param {!proto.routeguide.UserInfo} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.routeguide.Words>}
 *     Promise that resolves to the response
 */
proto.routeguide.RouteGuidePromiseClient.prototype.getRecommended =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/routeguide.RouteGuide/GetRecommended',
      request,
      metadata || {},
      methodDescriptor_RouteGuide_GetRecommended);
};


module.exports = proto.routeguide;

