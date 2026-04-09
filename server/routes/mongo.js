var express = require('express');
const { MongoClient } = require('mongodb');
var router = express.Router();

//----- Create MongoDB client -----
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DBNAME;
const collectionName = process.env.MONGO_COLLECTION;

const client = new MongoClient(uri);
let db;
let collection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error(err);
  }
}
connectDB();





//===========================================
//           Raw Text
//===========================================

// List all texts
// Usage: GET /get/list/texts
router.get('/list/texts', async (req, res) => {
  try {
    const texts = await collection.find({ textID: { $exists: true } }).toArray();
    res.status(200).json({ texts });
  } catch (err) {
    console.error(`Error listing texts: ${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Usage: GET /get/text?query=someTextID
router.get('/get/text', async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "id parameter is required" });
    }

    const Query = { "textID": req.query.id };
    const Result = await collection.findOne(Query);

    if (Result === null) {
      return res.status(404).json({ error: "Text not found" });
    }

    res.status(200).json(Result);

  } catch (err) {
    console.error(`Something went wrong trying to find text: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Usage: POST /add/text
// Body: { textID: "someID", ...otherFields }
router.post('/add/text', async (req, res) => {
  try {
    const newText = req.body;

    if (!newText.textID) {
      return res.status(400).json({ error: "textID is required" });
    }
    if (!newText.text) {
      return res.status(400).json({ error: "text is required" });
    }

    const Result = await collection.insertOne(newText);
    res.status(201).json({ message: "Text added successfully", insertedId: Result.insertedId });

  } catch (err) {
    console.error(`Something went wrong trying to add text: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Usage: DELETE /delete/text?query=someTextID
router.delete('/delete/text', async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "id parameter is required" });
    }

    const Query = { "textID": req.query.id };
    const Result = await collection.deleteOne(Query);

    if (Result.deletedCount === 0) {
      return res.status(404).json({ error: "Text not found, nothing deleted" });
    }

    res.status(200).json({ message: "Text deleted successfully" });

  } catch (err) {
    console.error(`Something went wrong trying to delete text: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Usage: PUT /update/text?query=someTextID
// Body: { text: ...new text...}
router.put('/update/text', async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "id parameter is required" });
    }

    const updates = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Request body cannot be empty" });
    }

    const Query = { "textID": req.query.id };
    const Result = await collection.updateOne(Query, { $set: updates });

    if (Result.matchedCount === 0) {
      return res.status(404).json({ error: "Text not found" });
    }

    res.status(200).json({ message: "Text updated successfully", modifiedCount: Result.modifiedCount });

  } catch (err) {
    console.error(`Something went wrong trying to update text: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});

//==========================================
//            raw Files
//==========================================

// List all images
// Usage: GET /get/list/images
router.get('/list/images', async (req, res) => {
  try {
    const images = await collection.find({ imageID: { $exists: true } }).toArray();
    res.status(200).json({ images });
  } catch (err) {
    console.error(`Error listing images: ${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Usage: GET /get/image?query=someImageID
// returns { imageID: "someID", r2ID: "r2Key" }
router.get('/get/image', async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "id parameter is required" });
    }

    const Query = { "imageID": req.query.id };
    const Result = await collection.findOne(Query);

    if (Result === null) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.status(200).json(Result);

  } catch (err) {
    console.error(`Something went wrong trying to find image: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Usage: POST /add/image
// Body: { imageID: "someID", ...otherFields }
router.post('/add/image', async (req, res) => {
  try {
    const newImage = req.body;

    if (!newImage.imageID) {
      return res.status(400).json({ error: "imageID is required" });
    }
    if(!newImage.r2ID){
       return res.status(400).json({ error: "r2ID is required" });
    }

    const Result = await collection.insertOne(newImage);
    res.status(201).json({ message: "Image added successfully", insertedId: Result.insertedId });

  } catch (err) {
    console.error(`Something went wrong trying to add image: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Usage: DELETE /delete/image?query=someImageID
router.delete('/delete/image', async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "id parameter is required" });
    }

    const Query = { "imageID": req.query.id };
    const Result = await collection.deleteOne(Query);

    if (Result.deletedCount === 0) {
      return res.status(404).json({ error: "Image not found, nothing deleted" });
    }

    res.status(200).json({ message: "Image deleted successfully" });

  } catch (err) {
    console.error(`Something went wrong trying to delete image: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});



//===========================================
//                Education
//===========================================


router.get('/list/educations', async (req, res) => {
  try {
    const docs = await collection.find({ docType: 'education' }).toArray();
    res.status(200).json({ educations: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /mongo/get/education?query=someTextID
router.get('/get/education', async (req, res) => {
  try {
    //error handling
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });

    //get object
    const doc = await collection.findOne({ textID: req.query.id, docType: 'education' });
    if (!doc) return res.status(404).json({ error: 'Education not found' });
    res.status(200).json(doc);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /mongo/add/education
// Body: { textID, (string, required)
//         school, (string, required)
//         degree, (string, required)
//          field, (string, required)
//          start, (string, required)
//            end, (string, not required)
//       location, (string, required)
//           logo, (string, required) --> holds r2ID string 
//          minor, (string, not required)
//            gpa, (string, required)
//        current  (boolean, required)
//        }
// NOTE: DOCTYPE= education is automatically added!

router.post('/add/education', async (req, res) => {
  try {

    // set up payload
    const doc = { ...req.body, docType: 'education' };

    //error handling
    if (!doc.textID) return res.status(400).json({ error: 'textID is required' }); 
    if (!doc.school)  return res.status(400).json({ error: 'school is required' });
    if (!doc.degree)  return res.status(400).json({ error: 'degree is required' }); 
    if (!doc.field)   return res.status(400).json({ error: 'field is required' }); 
    if (!doc.start)   return res.status(400).json({ error: 'start is required' }); 
    if (!doc.location)   return res.status(400).json({ error: 'location is required' }); 
    if (!doc.logo)   return res.status(400).json({ error: 'logo is required' }); 
    if (!doc.gpa)   return res.status(400).json({ error: 'gpa is required' }); 
    if (!doc.current)   return res.status(400).json({ error: 'current is required' }); 

    //insert
    const result = await collection.insertOne(doc);

    res.status(201).json({ message: 'Education added', insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// PUT /mongo/update/education?query=someTextID
router.put('/update/education', async (req, res) => {
  try {

    //error handling
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });
    const updates = req.body;
    if (!updates || Object.keys(updates).length === 0) return res.status(400).json({ error: 'Body cannot be empty' });
    

    //update the specified parameters
    const result = await collection.updateOne(
      { textID: req.query.id, docType: 'education' },
      { $set: updates }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Education not found' });
    res.status(200).json({ message: 'Education updated', modifiedCount: result.modifiedCount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// DELETE /mongo/delete/education?query=someTextID
router.delete('/delete/education', async (req, res) => {
  try {
    //error handling
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });
    
    //delete
    const result = await collection.deleteOne({ textID: req.query.id, docType: 'education' });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Education not found' });
    res.status(200).json({ message: 'Education deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//==========================================
//              EXPERIENCE
//==========================================


// GET /mongo/list/experiences
router.get('/list/experiences', async (req, res) => {
  try {
    const docs = await collection.find({ docType: 'experience' }).toArray();
    res.status(200).json({"experiences" : docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /mongo/get/experience?id=someTextID
router.get('/get/experience', async (req, res) => {
  try {
    //error handling
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });

    // get object
    const doc = await collection.findOne({ textID: req.query.id, docType: 'experience' });
    if (!doc) return res.status(404).json({ error: 'Experience not found' });
    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /mongo/add/experience
// Body: { textID, (string, required) 
//        company, (string, required) 
//           role,(string, required) 
//          start, (string, required) 
//            end, (string, required) 
//    description, (string, required) 
//           tech,(string, required)  
//            logo(string, required)    --> holds r2ID string 
// }
//"DOCTYPE: EXPERIENCE" is  ALREADY ADDED!
router.post('/add/experience', async (req, res) => {
  try {

    //set up body
    const doc = { ...req.body, docType: 'experience' };
    if (!doc.textID)      return res.status(400).json({ error: 'textID is required' });
    if (!doc.company)     return res.status(400).json({ error: 'company is required' });
    if (!doc.role)        return res.status(400).json({ error: 'role is required' });
    if (!doc.start)        return res.status(400).json({ error: 'start is required' });
    if (!doc.end)        return res.status(400).json({ error: 'end is required' });
    if (!doc.description) return res.status(400).json({ error: 'description is required' });
    if (!doc.tech) return res.status(400).json({ error: 'tech is required' });
    if (!doc.logo) return res.status(400).json({ error: 'logo is required' });
    
    //create 
    const result = await collection.insertOne(doc);
    res.status(201).json({ message: 'Experience added', insertedId: result.insertedId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /mongo/update/experience?query=someTextID
router.put('/update/experience', async (req, res) => {
  try {
    //error handling
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });
    const updates = req.body;
    if (!updates || Object.keys(updates).length === 0) return res.status(400).json({ error: 'Body cannot be empty' });

    //update specified
    const result = await collection.updateOne(
      { textID: req.query.id, docType: 'experience' },
      { $set: updates }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Experience not found' });
    res.status(200).json({ message: 'Experience updated', modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /mongo/delete/experience?id=someTextID
router.delete('/delete/experience', async (req, res) => {
  try {

    // error handling
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });

    // delete 
    const result = await collection.deleteOne({ textID: req.query.id, docType: 'experience' });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Experience not found' });
    res.status(200).json({ message: 'Experience deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ============================================
//                PROJECTS
// ============================================

router.get('/list/projects', async (req, res) => {
  try {
    const docs = await collection.find({ docType: 'project' }).toArray();
    res.status(200).json({ projects: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /mongo/get/project?query=someTextID
router.get('/get/project', async (req, res) => {
  try {

    //error handling
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });
    
    //get object
    const doc = await collection.findOne({ textID: req.query.id, docType: 'project' });
    if (!doc) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /mongo/add/project
// Body: { textID, (string, requried)
//          title, (string, required)
//    description, (string, required)
//          image, (string, requried) --> has r2ID already
// tech: string[], (string, seperated by commas, required)
//tags?: string[], (string, seperated by commas, required)
//          demo?, (string, optional)
//        github, (string, optional)
//      featured (bool, required)
// }
//"DOCTYPE: PROJECT" ALREADY ADDED!
router.post('/add/project', async (req, res) => {
  try {

    //create body
    const doc = { ...req.body, docType: 'project' };
    if (!doc.textID)      return res.status(400).json({ error: 'textID is required' });
    if (!doc.title)       return res.status(400).json({ error: 'title is required' });
    if (!doc.description) return res.status(400).json({ error: 'description is required' });
    if (!doc.image)       return res.status(400).json({ error: 'title is required' });
    if (!doc.tech)        return res.status(400).json({ error: 'tech tags are required' });
    if (!doc.tags)       return res.status(400).json({ error: 'title is required' });

    //create object
    const result = await collection.insertOne(doc);
    res.status(201).json({ message: 'Project added', insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// PUT /mongo/update/project?query=someTextID
router.put('/update/project', async (req, res) => {
  try {
    //error handling
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });

    //update specified keys
    const updates = req.body;
    if (!updates || Object.keys(updates).length === 0) return res.status(400).json({ error: 'Body cannot be empty' });
    const result = await collection.updateOne(
      { textID: req.query.id, docType: 'project' },
      { $set: updates }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ message: 'Project updated', modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /mongo/delete/project?query=someTextID
router.delete('/delete/project', async (req, res) => {
  try {
    if (!req.query.id) return res.status(400).json({ error: 'id parameter is required' });
    const result = await collection.deleteOne({ textID: req.query.id, docType: 'project' });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// ============================================
//              Site Config
// ============================================

// GET /mongo/get/config
router.get('/get/config', async (req, res) => {
  try {
    const doc = await collection.findOne({ docType: 'config' });
    res.status(200).json(doc || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /mongo/update/config
// Body: { fullText, eyebrowText, subHeadlineText, bio, resume, linkedin, github, tags[] }
router.put('/update/config', async (req, res) => {
  try {
    const updates = req.body;
    await collection.updateOne(
      { docType: 'config' },
      { $set: { ...updates, docType: 'config', textID: 'site-config' } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Config updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;