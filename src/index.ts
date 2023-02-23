type VehicleType = "motorcycle" | "car";

interface IVehicle {
    type: VehicleType,
    licensePlate?: string,
    model?: string
}



class Vehicle {
    private type: VehicleType;
    private licensePlate: string;
    private model: string;

    constructor(type: VehicleType, licensePlate: string, model: string) {
        this.model = model;
        this.type = type;
        this.licensePlate = licensePlate;
    }

    getVehicle() {
        return {
            model: this.model,
            type: this.type,
            licensePlate: this.licensePlate
        }
    }

    getLicensePlate() {
        return this.licensePlate;
    }

    getType(): VehicleType {
        return this.type;
    }
}

class Slot {
    private id: number;
    private allocated: boolean;
    private type: VehicleType;
    private vehicle?: Vehicle | null;

    constructor(id: number, allocated: boolean, type: VehicleType) {
        this.id = id;
        this.allocated = allocated;
        this.type = type;
    }

    getSlot() {
        return {
            id: this.id,
            allocated: this.allocated,
            type: this.type,
            vehicle: this.vehicle ? this.vehicle.getVehicle() : null
        }
    }

    setVehicle(vehicle: Vehicle) {
        this.vehicle = vehicle;
        this.allocated = true;
    }

    checkIfSlotIsAllocated() {
        return this.allocated;
    }

    getType() {
        return this.type;
    }

    getAllocated() {
        return this.allocated;
    }

    parkInVehicle(vehicle: Vehicle) {
        let licensePlate = vehicle.getLicensePlate();


        console.log("bati aqui")


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
    }

    unparkVehicle() {
        if (!this.vehicle) {
            this.sendMessage('park-free');
            return true;
        }

        let licensePlate = this.vehicle.getLicensePlate();

        this.vehicle = null;
        this.allocated = false;

        this.sendMessage('unpark', licensePlate);
    }

    sendMessage(type: string, licensePlate?: string | null) {
        let message = {};
        switch (type) {
            case 'park-success':
                message = {
                    success: true,
                    type: type,
                    message: `The car with license place ${licensePlate} has been parked succesfully`
                };

                console.log(message);
                break;
            case 'park-busy':
                message = {
                    success: false,
                    type: type,
                    message: `This slot is already busy`
                };

                console.log(message);
                break;
            case 'park-type-not-allowed':
                message = {
                    success: false,
                    type: type,
                    message: `This slot is not allowed for cars`
                };

                console.log(message);
                break;
            case 'unpark':
                message = {
                    success: true,
                    type: type,
                    message: `The car with license plate ${licensePlate} has been unpark successfully`
                };

                console.log(message);
                break;
            case 'park-free':
                message = {
                    success: false,
                    type: type,
                    message: `This park is free`
                };

                console.log(message);
                break;
            default:
                console.log(`Something is wrong, try again later`);
        }
    }
}


class Level {
    private id: number;
    private slots: Slot[] = [];
    private limitSlots: number;

    constructor(id: number, limitSlots: number, slots?: Slot[] | null) {
        this.id = id;
        this.limitSlots = limitSlots;

        if (slots) {
            this.addSlot(slots);
        }
    }

    getLevel() {
        return {
            id: this.id,
            slots: this.slots ? this.slots.map(slot => slot.getSlot()) : null,
            limitSlots: this.limitSlots
        }
    }

    setLimitSlots(limitSlots) {
        this.limitSlots = limitSlots;
    }

    private addSingleSlot(slot: Slot) {
        if (this.slots.length >= this.limitSlots) {
            return false;
        }

        this.slots.push(slot);
        return true;
    }

    private addManySlots(slots: Slot[]) {
        for (let i = 0; i < slots.length; i++) {
            if (!this.addSingleSlot(slots[i])) {
                break;
            }
        }
    }

    addSlot(object: Slot | Slot[]) {
        if (object instanceof Slot) {
            this.addSingleSlot(object);
            return;
        }
        if (object.length > this.limitSlots) {
            console.log(" Error:slot limit has been exceed")
            return
        }
        this.addManySlots(object);
        console.log("slot allocated successfuly ")
    }



    getSlots() {
        return this.slots
    }


    getSlotsAllowed(type: VehicleType) {
        let slotsAllowed = this.slots.filter(slot => {
            let isTypeAllowed = true;
            if (type == 'car') {
                isTypeAllowed = slot.getType() == type;
            }

            return slot.getAllocated() == false && isTypeAllowed;
        });

        return slotsAllowed;
    }

    allocateVehicleToSlot(vehicle: Vehicle) {
        let slotsAllowed = this.getSlotsAllowed(vehicle.getType());
        if (!slotsAllowed.length) {
            console.log("there is not available spot")
            return false;
        }
        slotsAllowed[0].parkInVehicle(vehicle);
        return true;
    }

    unallocateVehicleToSlot(vehicle: Vehicle) {
        // TODO
    }

}


const level1 = new Level(3, 3)
const Carslot = new Slot(41, false, "car")
const Motoslot2 = new Slot(42, false, "motorcycle")
const Carslot3 = new Slot(43, false, "car")
const Carslot4 = new Slot(44, false, "car")
const auto1 = new Vehicle("car", "ABC-123", "Fusca")
const auto2 = new Vehicle("motorcycle", "ABC-431", "Honda")
const slots = []

level1.addSlot(Motoslot2)
level1.allocateVehicleToSlot(auto1)


console.log(level1.getSlots())