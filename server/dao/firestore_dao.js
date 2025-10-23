const admin = require("../config/firebase");

class FirestoreDao {
  constructor(collectionName, Model) {
    this.collection = collectionName;
    this.Model = Model;
    this.db = admin.firestore();
  }

  // ✅ CREATE - Thêm document mới
  async create(data) {
    try {
      const docRef = this.db.collection(this.collection).doc();
      const docData = {
        ...data,
        id: docRef.id,
        created_at: admin.firestore.Timestamp.now(),
        updated_at: admin.firestore.Timestamp.now(),
      };
      await docRef.set(docData);
      return new this.Model(docData);
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.create():`, err.message);
      throw err;
    }
  }

  // ✅ READ ALL - Lấy tất cả documents
  async findAll() {
    try {
      const snapshot = await this.db.collection(this.collection).get();
      return snapshot.docs.map(doc => new this.Model(doc.data()));
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.findAll():`, err.message);
      throw err;
    }
  }

  // ✅ READ BY ID
  async findById(id) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      return doc.exists ? new this.Model(doc.data()) : null;
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.findById():`, err.message);
      throw err;
    }
  }

  // ✅ UPDATE
  async update(id, data) {
    try {
      const updateData = {
        ...data,
        updated_at: admin.firestore.Timestamp.now(),
      };
      await this.db.collection(this.collection).doc(id).update(updateData);
      const doc = await this.db.collection(this.collection).doc(id).get();
      return doc.exists ? new this.Model(doc.data()) : null;
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.update():`, err.message);
      throw err;
    }
  }

  // ✅ DELETE
  async delete(id) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      const data = doc.exists ? new this.Model(doc.data()) : null;
      await this.db.collection(this.collection).doc(id).delete();
      return data;
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.delete():`, err.message);
      throw err;
    }
  }

  // ✅ QUERY - Tìm theo field
  async findByField(fieldName, value) {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where(fieldName, "==", value)
        .get();
      return snapshot.docs.map(doc => new this.Model(doc.data()));
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.findByField():`, err.message);
      throw err;
    }
  }

  // ✅ QUERY - Lấy document đầu tiên theo field
  async findOneByField(fieldName, value) {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where(fieldName, "==", value)
        .limit(1)
        .get();
      return snapshot.docs.length > 0 
        ? new this.Model(snapshot.docs[0].data()) 
        : null;
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.findOneByField():`, err.message);
      throw err;
    }
  }

  // ✅ COUNT - Đếm số document
  async count() {
    try {
      const snapshot = await this.db.collection(this.collection).get();
      return snapshot.docs.length;
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.count():`, err.message);
      throw err;
    }
  }

  // ✅ BATCH DELETE
  async deleteMany(ids) {
    try {
      const batch = this.db.batch();
      ids.forEach(id => {
        batch.delete(this.db.collection(this.collection).doc(id));
      });
      await batch.commit();
      return true;
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.deleteMany():`, err.message);
      throw err;
    }
  }

  // ✅ QUERY WITH CONDITIONS - Truy vấn với điều kiện
  async findWithConditions(conditions, orderByField = null, orderByDirection = "asc", limit = null) {
    try {
      let query = this.db.collection(this.collection);
      
      // Áp dụng các điều kiện where
      for (const { field, operator, value } of conditions) {
        query = query.where(field, operator, value);
      }
      
      // Sắp xếp
      if (orderByField) {
        query = query.orderBy(orderByField, orderByDirection);
      }
      
      // Giới hạn số lượng
      if (limit) {
        query = query.limit(limit);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => new this.Model(doc.data()));
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.findWithConditions():`, err.message);
      throw err;
    }
  }

  // ✅ GET WITH ORDERING
  async getWithOrdering(orderByField, orderByDirection = "asc", limit = null) {
    try {
      let query = this.db.collection(this.collection).orderBy(orderByField, orderByDirection);
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => new this.Model(doc.data()));
    } catch (err) {
      console.error(`❌ Error in ${this.collection}.getWithOrdering():`, err.message);
      throw err;
    }
  }
}

module.exports = FirestoreDao;
