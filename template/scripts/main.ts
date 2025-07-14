import * as mc from "@minecraft/server"

function mainTick() {
    if (mc.system.currentTick % 100 === 0) {
        mc.world.sendMessage("Hello, world! @tick: " + mc.system.currentTick)
    }

    mc.system.run(mainTick)
}

mc.system.run(mainTick)