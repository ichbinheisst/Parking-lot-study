var Vehicle = /** @class */ (function () {
    function Vehicle(type, licensePlate, model) {
        this.model = model;
        this.type = type;
        this.licensePlate = licensePlate;
    }
    Vehicle.prototype.getVehicle = function () {
        return {
            model: this.model,
            type: this.type,
            licensePlate: this.licensePlate
        };
    };
    Vehicle.prototype.getLicensePlate = function () {
        return this.licensePlate;
    };
    Vehicle.prototype.getType = function () {
        return this.type;
    };
    return Vehicle;
}());
var Slot = /** @class */ (function () {
    function Slot(id, allocated, type) {
        this.id = id;
        this.allocated = allocated;
        this.type = type;
    }
    Slot.prototype.getSlot = function () {
        return {
            id: this.id,
            allocated: this.allocated,
            type: this.type,
            vehicle: this.vehicle ? this.vehicle.getVehicle() : null
        };
    };
    Slot.prototype.setVehicle = function (vehicle) {
        this.vehicle = vehicle;
        this.allocated = true;
    };
    Slot.prototype.checkIfSlotIsAllocated = function () {
        return this.allocated;
    };
    Slot.prototype.getType = function () {
        return this.type;
    };
    Slot.prototype.getAllocated = function () {
        return this.allocated;
    };
    Slot.prototype.parkInVehicle = function (vehicle) {
        var licensePlate = vehicle.getLicensePlate();
        console.log("bati aqui");
        if (this.allocated) {
            this.sendMessage('park-busy');
            return false;
        }
        if (vehicle.getVehicle().type != 'car') {
            this.setVehicle(vehicle);
            this.sendMessage('park-success', licensePlate);
            return true;
        }
        if (this.type == 'car') {
            this.setVehicle(vehicle);
            this.sendMessage('park-success', licensePlate);
            return true;
        }
        this.sendMessage("park-type-not-allowed", licensePlate);
        return false;
    };
    Slot.prototype.unparkVehicle = function () {
        if (!this.vehicle) {
            this.sendMessage('park-free');
            return true;
        }
        var licensePlate = this.vehicle.getLicensePlate();
        this.vehicle = null;
        this.allocated = false;
        this.sendMessage('unpark', licensePlate);
    };
    Slot.prototype.sendMessage = function (type, licensePlate) {
        var message = {};
        switch (type) {
            case 'park-success':
                message = {
                    success: true,
                    type: type,
                    message: "The car with license place ".concat(licensePlate, " has been parked succesfully")
                };
                console.log(message);
                break;
            case 'park-busy':
                message = {
                    success: false,
                    type: type,
                    message: "This slot is already busy"
                };
                console.log(message);
                break;
            case 'park-type-not-allowed':
                message = {
                    success: false,
                    type: type,
                    message: "This slot is not allowed for cars"
                };
                console.log(message);
                break;
            case 'unpark':
                message = {
                    success: true,
                    type: type,
                    message: "The car with license plate ".concat(licensePlate, " has been unpark successfully")
                };
                console.log(message);
                break;
            case 'park-free':
                message = {
                    success: false,
                    type: type,
                    message: "This park is free"
                };
                console.log(message);
                break;
            default:
                console.log("Something is wrong, try again later");
        }
    };
    return Slot;
}());
var Level = /** @class */ (function () {
    function Level(id, limitSlots, slots) {
        this.slots = [];
        this.id = id;
        this.limitSlots = limitSlots;
        if (slots) {
            this.addSlot(slots);
        }
    }
    Level.prototype.getLevel = function () {
        return {
            id: this.id,
            slots: this.slots ? this.slots.map(function (slot) { return slot.getSlot(); }) : null,
            limitSlots: this.limitSlots
        };
    };
    Level.prototype.setLimitSlots = function (limitSlots) {
        this.limitSlots = limitSlots;
    };
    Level.prototype.addSingleSlot = function (slot) {
        if (this.slots.length >= this.limitSlots) {
            return false;
        }
        this.slots.push(slot);
        return true;
    };
    Level.prototype.addManySlots = function (slots) {
        for (var i = 0; i < slots.length; i++) {
            if (!this.addSingleSlot(slots[i])) {
                break;
            }
        }
    };
    Level.prototype.addSlot = function (object) {
        if (object instanceof Slot) {
            this.addSingleSlot(object);
            return;
        }
        if (object.length > this.limitSlots) {
            console.log(" Error:slot limit has been exceed");
            return;
        }
        this.addManySlots(object);
        console.log("slot allocated successfuly ");
    };
    Level.prototype.getSlots = function () {
        return this.slots;
    };
    Level.prototype.getSlotsAllowed = function (type) {
        var slotsAllowed = this.slots.filter(function (slot) {
            var isTypeAllowed = true;
            if (type == 'car') {
                isTypeAllowed = slot.getType() == type;
            }
            return slot.getAllocated() == false && isTypeAllowed;
        });
        return slotsAllowed;
    };
    Level.prototype.allocateVehicleToSlot = function (vehicle) {
        var slotsAllowed = this.getSlotsAllowed(vehicle.getType());
        if (!slotsAllowed.length) {
            console.log("there is not available spot");
            return false;
        }
        slotsAllowed[0].parkInVehicle(vehicle);
        return true;
    };
    Level.prototype.unallocateVehicleToSlot = function (vehicle) {
        // TODO
    };
    return Level;
}());
var level1 = new Level(3, 3);
var Carslot = new Slot(41, false, "car");
var Motoslot2 = new Slot(42, false, "motorcycle");
var Carslot3 = new Slot(43, false, "car");
var Carslot4 = new Slot(44, false, "car");
var auto1 = new Vehicle("car", "ABC-123", "Fusca");
var auto2 = new Vehicle("motorcycle", "ABC-431", "Honda");
var slots = [];
level1.addSlot(Motoslot2);
level1.allocateVehicleToSlot(auto1);
console.log(level1.getSlots());
