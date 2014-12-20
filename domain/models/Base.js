var _ = require('lodash');

function Base(pool) {

    this.id = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();


    this.find = function baseFind(params, cb) {
        throw new Error("find not implemented");
    };

    this.create = function baseCreate(data, cb) {
        throw new Error("create not implemented");
    };

    this.update = function baseUpdate(id, cb) {
        throw new Error("update not implemented");
    };

    this.remove = function baseRemove(id, cb) {
        throw new Error("remove not implemented");
    };

    this.mapDataToDomain = function baseMapDataToDomain(dataModel) {
        throw new Error("mapDataToDomain not implemented");
    };

    this.setId = function setId(id) {
        this.id = id;
    };

    this.getId = function getId(id) {
        return this.id;
    };

    this.setCreatedAt = function setId(createdAt) {
        this.createdAt = createdAt;
    };

    this.getCreatedAt = function getCreatedAt() {
        return this.createdAt;
    };

    this.setUpdatedAt = function setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
    };

    this.getUpdatedAt = function getUpdatedAt() {
        return this.updatedAt;
    };

    return {
        find: this.find,
        create: this.create,
        update: this.update,
        remove: this.remove,
        setId: this.setId,
        setCreatedAt: this.setCreatedAt,
        setUpdatedAt: this.setUpdatedAt
    };
}

module.exports = Base;