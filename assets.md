## Asset Pipeline

**All assets are property of Jagex.** This tool is designed to assist players in overcoming difficult PVM encounters and as part of that, being faithful visually to the game is important.

## Sounds

Currently using https://github.com/lequietriot/Old-School-RuneScape-Cache-Tools. Sound IDs are just grabbed using Visual Sound Plugin or Runelite dev mode.

## Optimising Models

Install the [gltf-transform CLI](https://gltf-transform.dev/) using:

    npm install --global @gltf-transform/cli

Then in the directory that contains GLTF files:

for file in \*.gltf; do
gltf-transform optimize --compress meshopt $file $(echo $file | sed 's/\.gltf$/\.glb/')
done

## Scene models

Currently using a branch of [OSRS-Environment-Exporter](https://github.com/Supalosa/OSRS-Environment-Exporter/pull/1) with hardcoded overrides for the Inferno region to remove ground clutter and clear the space around Zuk.

## Other models

Using Dezinator's `osrscachereader` at https://github.com/Dezinater/osrscachereader:

### Player models

    npm run cmd modelBuilder item 26684,27235,27238,27241,26235,28902,13237,22249,12926,20997,11959,25865,23975,23979,23971,7462,22109,21021,21024 maleModel0,maleModel1 anim 808,819,824,820,822,821,426,5061,7618 name player split

    where:

        - 26684 # tzkal slayer helmet
        - 27235 # masori mask (f)
        - 27238 # masori body (f)
        - 27241 # masori legs (f)
        - 26235 # zaryte vambracess
        - 28902 # dizana's max cape (l)
        - 13237 # pegasian boots
        - 22249 # anguish (or)
        - 20997 # twisted bow
        - 12926 # toxic blowpipe
        - 11959 # black chinchompa
        - 25865 # bow of faerdhinen
        - 23975 # crystal body
        - 23979 # crystal legs
        - 23971 # crystal helm
        - 7462 # barrows gloves
        - 22109 # ava's assembler
        - 21021 # ancestral top (buggy)
        - 21024 # ancestral bottom (buggy)


      - 808 # idle
      - 819 # walk
      - 824 # run
      - 820 # rotate 180
      - 822 # strafe left
      - 821 # strafe right
      - 426 # fire bow
      - 5061 # fire blowpipe
      - 7618 # throw chinchompa

### NPC models

    # Zuk: Idle, Fire, Flinch, Die
    npm run cmd modelBuilder npc 7706 anim 7564,7566,7565,7562 name zuk

    # Ranger: Idle, Walk, Range, Melee, Die, Flinch
    npm run cmd modelBuilder npc 7698 anim 7602,7603,7605,7604,7606,7607 name ranger

    # Mager: Idle, Walk, Mage, Revive Melee, Die
    npm run cmd modelBuilder npc 7699 anim 7609,7608,7610,7611,7612,7613 name mager

    # Nibbler: Idle, Walk, Attack, Flinch, Die
    npm run cmd modelBuilder npc 7691 anim 7573,7572,7574,7575,7676 name nibbler

    # Nibbler: Idle, Walk, Attack, Flinch, Die
    npm run cmd modelBuilder npc 7691 anim 7573,7572,7574,7575,7676 name nibbler

    # Bat: Idle/Walk, Attack, Flinch, Die
    npm run cmd modelBuilder npc 7692 anim 7577,7578,7579,7580 name bat

    # Blob: Idle/Walk, Attack, Flinch, Die
    npm run cmd modelBuilder npc 7693 anim 7586,7586,7581,7582,7583,7585,7584 name blob

    # Meleer: Idle, Walk, Attack, Down, Up, Flinch, Die
    npm run cmd modelBuilder npc 7697 anim 7595,7596,7597,7600,7601,7598,7599 name meleer

    # Jad: Idle, Walk, Mage, Range, Melee, Flinch, Die
    npm run cmd modelBuilder npc 7700 anim 7589,7588,7592,7593,7590,7591,7594 name jad

    # Shield: Idle, Die
    npm run cmd modelBuilder npc 7707 anim 7567,7569 name shield
