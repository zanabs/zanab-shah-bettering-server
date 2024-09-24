

import express from 'express';
import path from 'path';
import fs from 'fs/promises'; 
import { fileURLToPath } from 'url';


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoryPath = path.join(__dirname, '../data/categories.json');
const foodPath = path.join(__dirname, '../data/free-and-low-cost-food-programs.geojson')
const shelterPath = path.join(__dirname, '../data/homeless-shelter-locations.geojson')
const gardenPath = path.join(__dirname, '../data/community-gardens-and-food-trees.geojson')
const culturePath = path.join(__dirname, '../data/cultural-spaces.geojson')
const mentalHealthPath = path.join(__dirname, '../data/mental-health-providers.geojson')
const dentalPath = path.join(__dirname, '../data/dental-providers.geojson')
const gbvPath=path.join(__dirname, '../data/gender-based-violence-support.geojson')

router.get('/categories', async (req, res) => {
  try {
    const data = await fs.readFile(categoryPath, 'utf8');
    const geoData = JSON.parse(data);
    res.json(geoData);
  } catch (err) {
    console.error('There has been an error readi the GeoJSON file:', err);
    res.status(500).send('There was an error reading the geoJSON file');
  }
});

router.get('/resources', async (req, res) => {
  // console.log(req)
  if(req.query.categoryId) {
    const categoryId = req.query.categoryId;

    console.log(req.query.categoryId)

    let filePath = null;

    if(categoryId === 'food') {
      filePath = foodPath;
    } else if (categoryId === 'shelter') {
      filePath = shelterPath;
    } else if (categoryId==='gardens') {
      filePath = gardenPath;
    } else if (categoryId==='cultural-support') {
      filePath = culturePath;
    } else if (categoryId==='mental-health') {
      filePath = mentalHealthPath;
    } else if (categoryId==='dentistry') {
      filePath = dentalPath;
    } else if (categoryId==='gbv') {
      filePath=gbvPath;
    }

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const geoData = JSON.parse(data).features;
      res.json(geoData);
    } catch (err) {
      console.error('There has been an error reading the GeoJSON file:', err);
      res.status(500).send('There was an error reading gbv geoJSON file');
    }
  } else {
    const data1 = await fs.readFile(foodPath, 'utf8');
    const geoData1 = JSON.parse(data1).features;

    const data2 = await fs.readFile(shelterPath, 'utf8');
    const geoData2 = JSON.parse(data2).features;

    const data3 = await fs.readFile(gardenPath, 'utf8');
    const geoData3= JSON.parse(data3).features;

    const data4 = await fs.readFile(culturePath, 'utf8');
    const geoData4 = JSON.parse(data4).features;

    const data5 = await fs.readFile(mentalHealthPath, 'utf8');
    const geoData5 = JSON.parse(data5).features;

    const data6 = await fs.readFile(dentalPath, 'utf8');
    const geoData6 = JSON.parse(data6).features;

    const data7 = await fs.readFile(gbvPath, 'utf8');
    const geoData7 = JSON.parse(data7).features;

    res.json(geoData1.concat(geoData2).concat(geoData3).concat(geoData4).concat(geoData5).concat(geoData6).concat(geoData7));
  }});


  router.get('/resources/:categoryId/:resourceId', async (req, res) => {

      const categoryId = req.params.categoryId;
      console.log(req.params.resourceId);
  
      
  
      let filePath = null;
  
      if(categoryId === 'food') {
        filePath = foodPath;
      } else if (categoryId === 'shelter') {
        filePath = shelterPath;
      } else if (categoryId==='gardens') {
        filePath =gardenPath;
      } else if (categoryId==='cultural-support') {
        filePath = culturePath;
      } else if (categoryId==='mental-health') {
        filePath = mentalHealthPath;
      } else if (categoryId==='dentistry') {
        filePath=dentalPath; 
      } else if (categoryId==='gbv') {
        filePath=gbvPath;
      }

      try {
        const resourcesData = await fs.readFile(filePath);
        const resources = JSON.parse(resourcesData).features;
        const foundResource = resources.find((resource)=> resource.id == req.params.resourceId);
        console.log(foundResource);

        res.send(foundResource);
      } catch (err) {
        console.error('There has been an error reading the GeoJSON file:', err);
        res.status(500).send('There was an error readg the geoJSON file');
      }

  })
  






export default router;
