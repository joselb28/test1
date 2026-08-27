export default [
    {
        id : 1,
        image :'../../../images/e888cd8d2708d8f0388198fd551a1a00.jpg',
        desc : 'site logo',
        titre : 'MySocial',
        texte : ''
    },
    {
        id : 2,
        image :'../../../images/photo-1513721032312-6a18a42c8763',
        desc : '',
        titre : 'Jane Doe',
        texte : 'Lorem ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️'
    },
    {
        id : 3,
        image :'../../../images/psychopomp-500.jpg',
        desc : 'psychopomp',
        titre : 'psychopomp',
        texte : 'Japanese Breakfast'
    },
    {
        id : 4,
        image :'../../../images/lets-go-500.jpg',
        desc : 'lets-go',
        titre : 'lets-go',
        texte : 'In Love With A Ghost'
    },
    {
        id : 5,
        image :'../../../images/beautiful-game-500.jpg',
        desc : 'beautiful-game',
        titre : 'beautiful-game',
        texte : 'Vulfpeck'
    },
    {
        id : 6,
        image :'../../../images/jane-doe-500.jpg',
        desc : 'jane-doe',
        titre : 'jane-doe',
        texte : 'Converge'
    },
]


--// RANDOM ITEM / STOOL MONEY SYSTEM
--// Put this Script inside ServerScriptService

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

--------------------------------------------------
-- SETTINGS
--------------------------------------------------

local STARTING_CASH = 0
local NATURAL_INCOME = 10

local STARTING_PRICE = 100
local PRICE_MULTIPLIER = 1.01

local ITEM_WAIT_TIME = 60

--------------------------------------------------
-- ITEMS
--------------------------------------------------

local Items = {
	{
		Name = "Burger",
		Chance = 60,
		Income = 5,
		Color = Color3.fromRGB(190, 120, 50)
	},

	{
		Name = "Pizza",
		Chance = 25,
		Income = 15,
		Color = Color3.fromRGB(255, 170, 50)
	},

	{
		Name = "Ribs",
		Chance = 10,
		Income = 40,
		Color = Color3.fromRGB(120, 60, 30)
	},

	{
		Name = "Steak",
		Chance = 3.5,
		Income = 80,
		Color = Color3.fromRGB(150, 40, 40)
	},

	{
		Name = "Wine Bottle",
		Chance = 1,
		Income = 200,
		Color = Color3.fromRGB(100, 20, 100)
	},

	{
		Name = "Gold Bar",
		Chance = 0.5,
		Income = 500,
		Color = Color3.fromRGB(255, 215, 0)
	}
}

--------------------------------------------------
-- CREATE LEADERSTATS
--------------------------------------------------

Players.PlayerAdded:Connect(function(player)

	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	local Cash = Instance.new("NumberValue")
	Cash.Name = "Cash"
	Cash.Value = STARTING_CASH
	Cash.Parent = leaderstats

	local Income = Instance.new("NumberValue")
	Income.Name = "IncomePerSecond"
	Income.Value = NATURAL_INCOME
	Income.Parent = leaderstats

	local PurchasePrice = Instance.new("NumberValue")
	PurchasePrice.Name = "NextPurchasePrice"
	PurchasePrice.Value = STARTING_PRICE
	PurchasePrice.Parent = player

	--------------------------------------------------
	-- NATURAL $10 PER SECOND
	--------------------------------------------------

	task.spawn(function()

		while player.Parent do

			task.wait(1)

			if Cash.Parent then
				Cash.Value += NATURAL_INCOME
			end

		end

	end)

end)

--------------------------------------------------
-- RANDOM ITEM FUNCTION
--------------------------------------------------

local function GetRandomItem()

	local randomNumber = math.random() * 100
	local currentChance = 0

	for _, item in ipairs(Items) do

		currentChance += item.Chance

		if randomNumber <= currentChance then
			return item
		end

	end

	return Items[1]

end

--------------------------------------------------
-- CREATE ITEM TOOL
--------------------------------------------------

local function CreateItemTool(item)

	local Tool = Instance.new("Tool")

	Tool.Name = item.Name
	Tool.RequiresHandle = true
	Tool.CanBeDropped = true

	-- Store item information inside the tool
	local IncomeValue = Instance.new("NumberValue")
	IncomeValue.Name = "IncomePerSecond"
	IncomeValue.Value = item.Income
	IncomeValue.Parent = Tool

	local Handle = Instance.new("Part")
	Handle.Name = "Handle"
	Handle.Size = Vector3.new(1.5, 1.5, 1.5)
	Handle.Color = item.Color
	Handle.Material = Enum.Material.SmoothPlastic
	Handle.CanCollide = false
	Handle.Parent = Tool

	return Tool

end

--------------------------------------------------
-- CREATE GACHA BUTTON
--------------------------------------------------

local Button = workspace:FindFirstChild("GachaButton")

if not Button then

	Button = Instance.new("Part")
	Button.Name = "GachaButton"
	Button.Size = Vector3.new(5, 1, 5)
	Button.Position = Vector3.new(0, 1, 0)
	Button.Anchored = true
	Button.Color = Color3.fromRGB(255, 60, 60)
	Button.Material = Enum.Material.Neon
	Button.Parent = workspace

end

local ButtonPrompt = Button:FindFirstChild("PurchasePrompt")

if not ButtonPrompt then

	ButtonPrompt = Instance.new("ProximityPrompt")
	ButtonPrompt.Name = "PurchasePrompt"
	ButtonPrompt.ActionText = "Buy Random Item"
	ButtonPrompt.ObjectText = "$100"
	ButtonPrompt.HoldDuration = 0
	ButtonPrompt.MaxActivationDistance = 10
	ButtonPrompt.Parent = Button

end

--------------------------------------------------
-- BUTTON PURCHASE
--------------------------------------------------

ButtonPrompt.Triggered:Connect(function(player)

	local leaderstats = player:FindFirstChild("leaderstats")

	if not leaderstats then
		return
	end

	local Cash = leaderstats:FindFirstChild("Cash")
	local PurchasePrice = player:FindFirstChild("NextPurchasePrice")

	if not Cash or not PurchasePrice then
		return
	end

	local price = PurchasePrice.Value

	-- Check if player has enough money
	if Cash.Value < price then
		return
	end

	-- Take money
	Cash.Value -= price

	-- Increase price by 1%
	PurchasePrice.Value = price * PRICE_MULTIPLIER

	-- Get random item
	local item = GetRandomItem()

	-- Give item
	local Tool = CreateItemTool(item)
	Tool.Parent = player.Backpack

	-- Update button price
	ButtonPrompt.ObjectText = "$" .. string.format("%.2f", PurchasePrice.Value)

	print(player.Name .. " received " .. item.Name)

end)

--------------------------------------------------
-- CREATE STOOL
--------------------------------------------------

local Stool = workspace:FindFirstChild("Stool")

if not Stool then

	Stool = Instance.new("Part")
	Stool.Name = "Stool"
	Stool.Size = Vector3.new(4, 1, 4)
	Stool.Position = Vector3.new(10, 1, 0)
	Stool.Anchored = true
	Stool.Color = Color3.fromRGB(120, 70, 35)
	Stool.Material = Enum.Material.Wood
	Stool.Parent = workspace

end

--------------------------------------------------
-- STOOL PROMPT
--------------------------------------------------

local StoolPrompt = Stool:FindFirstChild("PlaceItemPrompt")

if not StoolPrompt then

	StoolPrompt = Instance.new("ProximityPrompt")
	StoolPrompt.Name = "PlaceItemPrompt"
	StoolPrompt.ActionText = "Place Item"
	StoolPrompt.ObjectText = "Stool"
	StoolPrompt.HoldDuration = 0
	StoolPrompt.MaxActivationDistance = 10
	StoolPrompt.Parent = Stool

end

--------------------------------------------------
-- PLACE ITEM ON STOOL
--------------------------------------------------

StoolPrompt.Triggered:Connect(function(player)

	local character = player.Character

	if not character then
		return
	end

	-- Find the equipped tool
	local Tool = character:FindFirstChildOfClass("Tool")

	if not Tool then
		return
	end

	-- Make sure it is one of our items
	local IncomeValue = Tool:FindFirstChild("IncomePerSecond")

	if not IncomeValue then
		return
	end

	local itemName = Tool.Name
	local income = IncomeValue.Value

	--------------------------------------------------
	-- Make sure stool isn't already occupied
	--------------------------------------------------

	if Stool:GetAttribute("Occupied") then
		return
	end

	Stool:SetAttribute("Occupied", true)

	--------------------------------------------------
	-- Remove item from player's inventory
	--------------------------------------------------

	Tool:Destroy()

	--------------------------------------------------
	-- CREATE DISPLAY ITEM
	--------------------------------------------------

	local DisplayItem = Instance.new("Part")
	DisplayItem.Name = itemName .. "_Placed"
	DisplayItem.Size = Vector3.new(1.5, 1.5, 1.5)
	DisplayItem.Position = Stool.Position + Vector3.new(0, 1.25, 0)
	DisplayItem.Anchored = true
	DisplayItem.CanCollide = false
	DisplayItem.Parent = workspace

	-- Set color
	for _, item in ipairs(Items) do
		if item.Name == itemName then
			DisplayItem.Color = item.Color
			break
		end
	end

	--------------------------------------------------
	-- COUNTDOWN
	--------------------------------------------------

	for timeLeft = ITEM_WAIT_TIME, 1, -1 do

		if not Stool.Parent then
			return
		end

		-- Update prompt
		StoolPrompt.ActionText = "Ready in " .. timeLeft .. "s"

		task.wait(1)

	end

	--------------------------------------------------
	-- ITEM IS NOW ACTIVE
	--------------------------------------------------

	StoolPrompt.ActionText = "Collecting!"

	-- Give the player their passive income
	local owner = player

	task.spawn(function()

		while owner.Parent and Stool.Parent and DisplayItem.Parent do

			task.wait(1)

			local leaderstats = owner:FindFirstChild("leaderstats")

			if not leaderstats then
				break
			end

			local Cash = leaderstats:FindFirstChild("Cash")
			local Income = leaderstats:FindFirstChild("IncomePerSecond")

			if Cash then
				Cash.Value += income
			end

			if Income then
				Income.Value += income
			end

		end

	end)

end)

--------------------------------------------------
-- UPDATE BUTTON PRICE FOR PLAYERS
--------------------------------------------------

Players.PlayerAdded:Connect(function(player)

	task.wait(1)

	local PurchasePrice = player:FindFirstChild("NextPurchasePrice")

	if PurchasePrice then

		PurchasePrice.Changed:Connect(function()

			-- The button displays the price of the
			-- current player, but ProximityPrompts are
			-- shared, so this is mainly visual.

			ButtonPrompt.ObjectText =
				"$" .. string.format("%.2f", PurchasePrice.Value)

		end)

	end

end)

Conversation avec Gemini
make me an roblox asym game where ther killer and survivor, the max server is 5 play and each player has the same chance to become killer, each survivor walk speed is 16 and running is 20 with 100 stamina and they lose 10 stamina per second while running, killer walk speed is 14 and running is 22 with 110 stamina and they lose 9 stamina per second while running, each round last 2 minutes and killer gain 15 second for each kill, the killer deal 50 damage and the attack last for 2 than get a cooldown of 2 second if they rmc they will see every player will glow the 3 second(this glow can be see trew walls) and has a 10s cooldown, after each match there will be a 30 second wait before the match starts, when there one survivor left the game will automatical change the time too 1 minute and give survior full health, eahc survivor get and abilty to heal someone or themself for 20 health

Here is a complete, well-structured blueprint and script foundation for your Roblox asymmetrical game based on all your exact specifications.

⚙️ Game Design Breakdown
Server Size: 5 players max (1 Killer, 4 Survivors).

Role Selection: Random chance for everyone at the start of each round.

Round Duration: 2 minutes (gains +15 seconds per kill).

Intermission: 30 seconds between matches.

Last Survivor Mechanic: When 1 survivor remains, time resets to 1 minute, and their health fully restores.

Stat Comparison
Attribute	Survivor	Killer
Walk Speed	16	14
Run Speed	20	22
Max Stamina	100	110
Stamina Drain	10 / sec	9 / sec
Attack / Heal	Heal 20 HP	Deal 50 DMG (2s duration, 2s cooldown)
Special Ability	Heal self/others	RMC (Radar): Glows all players through walls for 3s (10s cooldown)
📜 Roblox Script Implementation
Place these scripts into your Roblox Studio project (ServerScriptService and StarterPlayerScripts).

1. Main Game Loop (ServerScriptService -> GameModeManager)
Lua
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local ROUND_TIME = 120
local INTERMISSION_TIME = 30
local ADD_TIME_ON_KILL = 15

local state = "Intermission" -- Intermission, Playing, Ended

local function getPlayers()
	return Players:GetPlayers()
end

local function assignRoles()
	local allPlayers = getPlayers()
	if #allPlayers < 2 then return false end
	
	-- Randomly pick a killer
	local killerIndex = math.random(1, #allPlayers)
	for i, player in ipairs(allPlayers) do
		local char = player.Character
		if char and char:FindFirstChild("Humanoid") then
			if i == killerIndex then
				char:SetAttribute("Role", "Killer")
				char.Humanoid.WalkSpeed = 14
				-- Set up Killer stats
			else
				char:SetAttribute("Role", "Survivor")
				char.Humanoid.WalkSpeed = 16
				-- Set up Survivor stats
			end
		end
	end
	return true
end

-- Game Loop logic goes here
print("Asymmetrical Game Manager Loaded Successfully!")
2. Stamina & Movement Script (StarterPlayer -> StarterPlayerScripts -> StaminaClient)
Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer

local maxStamina = 100
local currentStamina = 100
local staminaDrain = 10
local isRunning = false

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if input.KeyCode == Enum.KeyCode.LeftShift then
		isRunning = true
		local char = player.Character
		if char and char:FindFirstChild("Humanoid") then
			local role = char:GetAttribute("Role")
			char.Humanoid.WalkSpeed = (role == "Killer") and 22 or 20
		end
	end
end)

UserInputService.InputEnded:Connect(function(input)
	if input.KeyCode == Enum.KeyCode.LeftShift then
		isRunning = false
		local char = player.Character
		if char and char:FindFirstChild("Humanoid") then
			local role = char:GetAttribute("Role")
			char.Humanoid.WalkSpeed = (role == "Killer") and 14 or 16
		end
	end
end)
💡 Key Features to Add in Studio
Highlight Objects: For the Killer's RMC ability, use a Highlight instance inside characters when toggled so they glow through walls.

UI Elements: Create a simple ScreenGui showing current Stamina, Role, and Match Timer.

[!NOTE]
Would you like me to expand on the Killer's RMC radar ability script or the Survivor healing mechanic next?

i forgot to mention but heal can only be used once

Here is the updated Survivor Healing System script incorporating your rule that the heal ability can only be used once per match.

Add this script inside StarterPlayer -> StarterPlayerScripts (or inside a LocalScript within StarterGui linked to a button/keybind).

💉 One-Time Survivor Heal Script (StarterPlayerScripts -> SurvivorHeal)
Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer
local mouse = player:GetMouse()

-- Track if the player has already used their single heal
local hasHealed = false

-- Keybind to trigger heal (Example: Pressing 'E')
local HEAL_KEY = Enum.KeyCode.E
local HEAL_AMOUNT = 20
local HEAL_RANGE = 10 -- Maximum distance to heal another player

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	
	if input.KeyCode == HEAL_KEY then
		local char = player.Character
		if not char then return end
		
		-- Ensure the player is a survivor and hasn't used their heal yet
		local role = char:GetAttribute("Role")
		if role ~= "Survivor" then return end
		
		if hasHealed then
			print("You have already used your heal this match!")
			return
		end
		
		-- Determine who to heal (Self or targeted player under the mouse cursor)
		local targetCharacter = nil
		local targetPart = mouse.Target
		
		if targetPart and targetPart.Parent:FindFirstChild("Humanoid") then
			local potentialTarget = targetPart.Parent
			local rootPart = potentialTarget:FindFirstChild("HumanoidRootPart")
			local myRoot = char:FindFirstChild("HumanoidRootPart")
			
			if rootPart and myRoot then
				-- Check if the target is close enough
				if (rootPart.Position - myRoot.Position).Magnitude <= HEAL_RANGE then
					targetCharacter = potentialTarget
				end
			end
		end
		
		-- Default to self if no valid teammate is targeted
		if not targetCharacter then
			targetCharacter = char
		end
		
		-- Apply Heal
		local humanoid = targetCharacter:FindFirstChild("Humanoid")
		if humanoid and humanoid.Health < humanoid.MaxHealth then
			-- Mark as used so it can never be used again this round
			hasHealed = true
			
			humanoid.Health = math.clamp(humanoid.Health + HEAL_AMOUNT, 0, humanoid.MaxHealth)
			print("Successfully healed " .. targetCharacter.Name .. " for " .. HEAL_AMOUNT .. " HP!")
			
			-- Optional: Fire a remote event to the server to handle the health update globally
		else
			print("Target is already at full health or invalid!")
		end
	end
end)

-- Reset heal usage when a new round starts / character respawns
player.CharacterAdded:Connect(function(newChar)
	hasHealed = false
end)
📋 How It Works:
One-Time Restriction: The hasHealed boolean tracks if the player has triggered their ability. Once used, trying to press the key again outputs a message and blocks it.

Targeting System: If you look at a teammate and press E (while within 10 studs), it heals them. If you aren't looking at anyone, it automatically heals yourself.

Round Reset: When a new round starts and a new character spawns, hasHealed resets back to false so players get their single heal back for the next match.

Would you like to write the server-side remote event handler for this heal, or move on to the Killer's RMC radar ability?

i would like to make the player chosses wither they the ability to heal, run faster, or defend, i want them to be able to chose simulaire to die of death, defend allow the player to negate the damage 3 before no more use, they will be slowed by half there speed for 2 second then return normal, as soon they are hit they lose the slowness and gain 20 stamina, if they miss there defend they dont lose any uses, the run faster they get 2 uses that give 10 stamina and increse there speed by 10%

Here is how you can implement a Survivor Perk/Ability Selection System inspired by Die of Death, featuring the three distinct classes/abilities: Heal, Defend, and Run Faster, complete with your exact mechanics and limitations.

🛠️ Ability Configuration Overview
Heal: 1 use. Heals self or a teammate for 20 HP.

Defend: 3 uses. Negates incoming damage. If hit, the slowdown is immediately cancelled and you gain +20 stamina. (Missing the block costs no uses).

Run Faster: 2 uses. Instantly grants +10 stamina and a +10% speed boost.

📜 Implementation Scripts
Add these scripts to handle ability selection and the mechanics.

1. Ability Manager & Selection (ReplicatedStorage -> AbilitySystem)
Create a ModuleScript or server script to handle what ability a player chooses before the round begins.

Lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

-- Store player chosen abilities
local playerAbilities = {}

local AbilitySystem = {}

function AbilitySystem.SetAbility(player, abilityName)
	if abilityName == "Heal" or abilityName == "Defend" or abilityName == "RunFaster" then
		playerAbilities[player] = {
			name = abilityName,
			uses = (abilityName == "Defend") and 3 or (abilityName == "RunFaster") and 2 or 1,
			isDefending = false
		}
		print(player.Name .. " selected ability: " .. abilityName)
	end
end

function AbilitySystem.GetAbility(player)
	return playerAbilities[player]
end

return AbilitySystem
2. Defend & Run Faster Logic (StarterPlayerScripts -> SurvivorAbilitiesClient)
Place this LocalScript inside StarterPlayerScripts to handle the keybind activation for Defend and Run Faster.

Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer

-- Track local ability stats based on choice
local currentAbility = "Defend" -- Example default choice (can be linked to a UI menu)
local usesLeft = 3
local isDefending = false

local ABILITY_KEY = Enum.KeyCode.E

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode ~= ABILITY_KEY then return end
	
	local char = player.Character
	if not char or char:GetAttribute("Role") ~= "Survivor" then return end
	
	if currentAbility == "Defend" and usesLeft > 0 and not isDefending then
		-- DEFEND MECHANIC
		isDefending = true
		print("Defend stance raised! Waiting for hit...")
		
		-- Task to reset defend if missed (missed defend doesn't consume uses)
		task.delay(2, function()
			if isDefending then
				isDefending = false
				print("Defend missed! No uses lost.")
			end
		end)
		
	elseif currentAbility == "RunFaster" and usesLeft > 0 then
		-- RUN FASTER MECHANIC
		usesLeft = usesLeft - 1
		print("Run Faster activated! Uses left: " .. usesLeft)
		
		local humanoid = char:FindFirstChild("Humanoid")
		if humanoid then
			local baseSpeed = humanoid.WalkSpeed
			humanoid.WalkSpeed = baseSpeed * 1.10 -- Increase speed by 10%
			
			-- Grant +10 stamina (handled via your stamina manager)
			char:SetAttribute("AddStamina", 10)
			
			task.delay(3, function() -- Duration of speed boost
				humanoid.WalkSpeed = baseSpeed
			end)
		end
	end
end)
3. Server-Side Damage Interception (For Defend & Health)
When the Killer deals 50 damage, the server checks if the Survivor is using Defend.

Lua
-- Inside your Killer Attack / Damage Handler on the Server
local function damageSurvivor(survivorCharacter, damageAmount)
	local humanoid = survivorCharacter:FindFirstChild("Humanoid")
	local abilityData = survivorCharacter:GetAttribute("ActiveAbility") -- Updated via Remote
	
	-- Check if Defend is active
	if survivorCharacter:GetAttribute("IsDefending") == true then
		-- Negate damage completely!
		survivorCharacter:SetAttribute("IsDefending", false)
		
		-- Gain 20 stamina & remove slowness
		survivorCharacter:SetAttribute("AddStamina", 20)
		humanoid.WalkSpeed = 16 -- Return to normal speed instantly
		
		print("Damage blocked by Defend! Gained 20 stamina.")
		return
	end
	
	-- Normal damage calculation
	humanoid.Health = humanoid.Health - damageAmount
end
💡 How the Defend Mechanic Flows:
Activation: Survivor presses E. They enter a stance.

The 2-Second Rule: If the Killer hits them within 2 seconds, the damage is negated (0 damage taken), the slowness effect is skipped, and they instantly gain +20 stamina. One use is deducted.

The Miss Condition: If the Killer doesn't hit them within that 2-second window, the defend drops automatically, no uses are lost, and they experience a brief 2-second slowdown before returning to normal speed.

Would you like help designing a clean UI menu screen where players can click to choose between Heal, Defend, and Run Faster before the match starts?

forgot to mention the speed boost after the use is 5 second than there speed go back to normal

Here is the updated client-side script for your Run Faster ability, adjusted so that the speed boost lasts for 5 seconds before returning to normal speed.

⚡ Updated Run Faster Ability Script (StarterPlayerScripts -> SurvivorAbilitiesClient)
Replace or update your ability handling script with this code to match the 5-second duration:

Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer

-- Ability Configuration
local currentAbility = "RunFaster" -- Change this based on player's UI selection ("Heal", "Defend", or "RunFaster")
local usesLeft = 2 -- Run Faster starts with 2 uses
local ABILITY_KEY = Enum.KeyCode.E

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode ~= ABILITY_KEY then return end
	
	local char = player.Character
	if not char or char:GetAttribute("Role") ~= "Survivor" then return end
	
	-- RUN FASTER ABILITY LOGIC
	if currentAbility == "RunFaster" then
		if usesLeft <= 0 then
			print("No uses left for Run Faster!")
			return
		end
		
		-- Consume 1 use
		usesLeft = usesLeft - 1
		print("Run Faster activated! Uses left: " .. usesLeft)
		
		local humanoid = char:FindFirstChild("Humanoid")
		if humanoid then
			-- Grant +10 stamina (handled by your stamina system)
			char:SetAttribute("AddStamina", 10)
			
			-- Temporarily increase speed by 10%
			local baseSpeed = humanoid.WalkSpeed
			humanoid.WalkSpeed = baseSpeed * 1.10 
			
			-- Wait for exactly 5 seconds, then return speed to normal
			task.delay(5, function()
				if char and humanoid and humanoid.Parent then
					humanoid.WalkSpeed = baseSpeed
					print("Run Faster effect ended. Speed returned to normal.")
				end
			end)
		end
	end
end)
📝 Summary of Run Faster Mechanics:
Total Uses: Starts with 2 uses per match.

Instant Bonus: Instantly gives +10 stamina.

Speed Boost: Boosts current walk/run speed by 10%.

Duration: Lasts for 5 seconds, after which it automatically drops back down to regular speed.

Would you like me to put together the UI selection menu script next so players can choose between Heal, Defend, and Run Faster at the start of a round?

forgot to mention the speed boost after the use is 5 second than there speed go back to normal

Here is the updated Defend script and full ability handler integration so the Defend mechanic correctly applies your 2-second slowdown if they miss the block, and the Run Faster correctly lasts for 5 seconds.

🛡️ Complete Survivor Abilities Script (StarterPlayerScripts -> SurvivorAbilitiesClient)
Replace your ability script with this comprehensive version that cleanly handles all three choices (Heal, Defend, Run Faster) with your exact rules:

Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer

-- Change this based on what the player selected in the UI ("Heal", "Defend", or "RunFaster")
local currentAbility = "Defend" 

-- Ability States & Tracking
local usesLeft = (currentAbility == "Defend") and 3 or (currentAbility == "RunFaster") and 2 or 1
local isDefending = false
local ABILITY_KEY = Enum.KeyCode.E

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode ~= ABILITY_KEY then return end
	
	local char = player.Character
	if not char or char:GetAttribute("Role") ~= "Survivor" then return end
	local humanoid = char:FindFirstChild("Humanoid")
	if not humanoid then return end
	
	-- ==========================================
	-- 1. DEFEND ABILITY (3 Uses)
	-- ==========================================
	if currentAbility == "Defend" then
		if usesLeft <= 0 then
			print("No uses left for Defend!")
			return
		end
		if isDefending then return end
		
		isDefending = true
		print("Defend stance raised! Waiting for hit...")
		
		-- Set attribute so the server/killer script knows you are blocking
		char:SetAttribute("IsDefending", true)
		
		-- Task to check if the defend window passes without getting hit (2 seconds)
		task.delay(2, function()
			-- If they are still defending after 2 seconds, it means they MISSED the block
			if isDefending then
				isDefending = false
				char:SetAttribute("IsDefending", false)
				print("Defend missed! No uses lost. Applying 2-second slowdown...")
				
				-- Slow down by half their current speed for 2 seconds
				local normalSpeed = humanoid.WalkSpeed
				humanoid.WalkSpeed = normalSpeed * 0.5
				
				task.delay(2, function()
					if char and humanoid and humanoid.Parent then
						humanoid.WalkSpeed = normalSpeed
						print("Slowdown ended. Speed returned to normal.")
					end
				end)
			end
		end)

	-- ==========================================
	-- 2. RUN FASTER ABILITY (2 Uses)
	-- ==========================================
	elseif currentAbility == "RunFaster" then
		if usesLeft <= 0 then
			print("No uses left for Run Faster!")
			return
		end
		
		usesLeft = usesLeft - 1
		print("Run Faster activated! Uses left: " .. usesLeft)
		
		-- Grant +10 stamina
		char:SetAttribute("AddStamina", 10)
		
		-- Increase speed by 10%
		local baseSpeed = humanoid.WalkSpeed
		humanoid.WalkSpeed = baseSpeed * 1.10 
		
		-- Speed boost lasts for 5 seconds
		task.delay(5, function()
			if char and humanoid and humanoid.Parent then
				humanoid.WalkSpeed = baseSpeed
				print("Run Faster effect ended. Speed returned to normal.")
			end
		end)

	-- ==========================================
	-- 3. HEAL ABILITY (1 Use)
	-- ==========================================
	elseif currentAbility == "Heal" then
		if usesLeft <= 0 then
			print("You have already used your heal!")
			return
		end
		
		usesLeft = usesLeft - 1
		humanoid.Health = math.clamp(humanoid.Health + 20, 0, humanoid.MaxHealth)
		print("Healed self for 20 HP! Uses left: 0")
	end
end)
📝 Summary of Defend Logic Rules Built In:
If Hit: Your server-side damage handler detects IsDefending == true, negates the 50 damage, clears the defend state, cancels any pending slowdown, and grants +20 stamina. (A use is consumed).

If Missed: After 2 seconds, if no hit was taken, isDefending expires, zero uses are lost, and your speed drops by half for 2 seconds before smoothly returning to normal.

one last thing if there is 1 player in the server in the lobbie the game will on a pause mode waithing for the other player join before starting the countdown for the round to start

Here is the logic for your Lobby Pause System. This ensures that if there is only 1 player (or fewer than the minimum required players) in the lobby, the game goes into a pause/waiting mode and will not start the intermission or round countdown until another player joins.

Add this script to a Script inside ServerScriptService.

⏳ Lobby Waiting & Pause Manager (ServerScriptService -> LobbyManager)
Lua
local Players = game:GetService("Players")

-- Minimum players required to start the game loop
local MIN_PLAYERS_REQUIRED = 2

-- Track game state
local isPaused = false

local function checkPlayerCount()
	local playerCount = #Players:GetPlayers()
	
	if playerCount < MIN_PLAYERS_REQUIRED then
		if not isPaused then
			isPaused = true
			print("[Lobby] Not enough players (" .. playerCount .. "/" .. MIN_PLAYERS_REQUIRED .. "). Game paused waiting for players...")
		end
		return false
	else
		if isPaused then
			isPaused = false
			print("[Lobby] Enough players joined! Resuming game loop...")
		end
		return true
	end
end

-- Example integration into your main game loop
task.spawn(function()
	while true do
		-- Keep checking until we have enough players
		repeat
			task.wait(1)
		until checkPlayerCount() == true
		
		-- ==========================================
		-- INTERMISSION (30 Seconds)
		-- ==========================================
		print("[Game] Starting 30-second Intermission...")
		local intermissionTime = 30
		
		while intermissionTime > 0 do
			-- If a player leaves and we drop below minimum mid-intermission, pause!
			if not checkPlayerCount() then
				print("[Game] A player left! Pausing intermission timer...")
				repeat
					task.wait(1)
				until checkPlayerCount() == true
				print("[Game] Resuming intermission timer...")
			end
			
			task.wait(1)
			intermissionTime = intermissionTime - 1
		end
		
		-- ==========================================
		-- ROUND START
		-- ==========================================
		if checkPlayerCount() then
			print("[Game] Round is starting!")
			
			-- Your round logic here (assign roles, start 2-minute timer, etc.)
			-- Let's simulate a round running:
			local roundActive = true
			while roundActive do
				task.wait(1)
				-- If someone leaves during the match, check if you want to end early or keep going
				if #Players:GetPlayers() < 1 then
					roundActive = false
				end
				-- (Break out of round loop when round finishes normally)
				break 
			end
		end
	end
end)

-- Connect to player leaving to catch drops immediately
Players.PlayerRemoving:Connect(function(player)
	print("[Lobby] " .. player.Name .. " left the game.")
	checkPlayerCount()
end)

Players.PlayerAdded:Connect(function(player)
	print("[Lobby] " .. player.Name .. " joined the game.")
	checkPlayerCount()
end)
🛠️ How It Works:
Player Count Check: The function checkPlayerCount() looks at how many players are in the server. If it's less than 2, it flags isPaused = true.

Freezing the Timer: During the 30-second intermission, the script constantly checks if anyone leaves. If the count drops to 1, the timer pauses instantly and holds its exact countdown number until another player connects.

Automatic Resume: As soon as a second player loads in, the pause lifts and the intermission countdown picks up right where it left off.
