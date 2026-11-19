const express = require("express");
const { eq } = require("drizzle-orm");
const { potions } = require("../db/schema");
const { db } = require("../db/db");    
const router = express.Router();

router.get("/" ,async (req, res) => {
  try {
    const allPotions = await db.select().from(potions)
    return res.status(200).json(allPotions);
  }catch (error) {
    return res.status(500).json({ error: "Failed to fetch potions" });
  }
});

router.get("/:id", async (req, res) => {
    try{
        const [potion] = await db.select().from(potions).where(eq(potions.id, +req.params.id))
        if(!potion){
            return res.status(404).json({ error: "Potion not found" });
        }
        return res.status(200).json(potion);
    }catch (error) {
        return res.status(500).json({ error: "Failed to fetch potion" });
    }
})


router.post("/", async (req, res) => {
    const { name, effects, isDangerous } = req.body;
    try{
        if(!name) return res.status(400).json({ error: "Potion name is required" });
        if(!effects) return res.status(400).json({ error: "Potion effects are required" });
        if(isDangerous === undefined) return res.status(400).json({ error: "Potion danger status is required" })

        await db.insert(potions).values({
            name: name, 
            effects: effects, 
            isDangerous: isDangerous 
        });
        return res.status(201).json({ message: "Potion created successfully" });
    }catch (error) {
        return res.status(500).json({ error: "Failed to create potion" });
    }
})

router.delete("/:id", async (req, res) => {
    try{
        const[entry] = await db.select().from(potions).where(eq(potions.id, req.params.id));
        if(!entry){
            return res.status(404).json({ Message: "Potion not found" });
        }
        await db.delete(potions).where(eq(potions.id, +req.params.id));
        return res.status(200).json({ message: "Potion deleted successfully" });
    }catch (error) {
        return res.status(500).json({ error: "Failed to delete potion" });
    }
})

module.exports = router;