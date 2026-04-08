## Asset Pipeline

**All assets are property of Jagex.** This tool is designed to assist players in overcoming difficult PVM encounters and as part of that, being faithful visually to the game is important.

## Sounds

Currently using https://github.com/lequietriot/Old-School-RuneScape-Cache-Tools. Sound IDs are just grabbed using Visual Sound Plugin or Runelite dev mode.

## Optimising Models

Install the [gltf-transform CLI](https://gltf-transform.dev/) using:

    npm install --global @gltf-transform/cli

Then in the directory that contains GLTF files:

for file in *.gltf; do
    gltf-transform optimize --compress meshopt $file $(echo $file | sed 's/\.gltf$/\.glb/')
done

## Scene models

Currently using a branch of [OSRS-Environment-Exporter](https://github.com/Supalosa/OSRS-Environment-Exporter/pull/1) with hardcoded overrides for the Inferno region to remove ground clutter and clear the space around Zuk.

## Other models

Using Dezinator's `osrscachereader` at https://github.com/Dezinater/osrscachereader:

### Player models

    npm run cmd modelBuilder item 26684,27235,27238,27241,26235,28902,13237,22249,12926,20997,11959,25865,23975,23979,23971,7462,22109,21021,21024,11785,24422,29806,30079,30082,23444,6889,10499,19720,4502,6107,4675,21006,28254,28256,28258,20366,22981,13239,25739,21295,29796,29801,30753,30750,30756,31097,28338,23995,22322,31106 maleModel0,maleModel1 anim 808,819,824,820,822,821,426,5061,7618,8057,8056,390,440,813,10172,10169,4230,1979 name player split

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
        - 11785 # armadyl crossbow
        - 24422 # nightmare staff
        - 29806 # aranea boots
        - 30079 # hueycoatl hide chaps
        - 30082 # hueycoatl hide vambraces
        - 23444 # tormented bracelet (or)
        - 6889 # mage's book
        - 10499 # ava's accumulator
        - 19720 # occult neck (or)
        - 4502 # bearhead
        - 6107 # ghostly robe top
        - 4675 # ancient staff
        - 21006 # kodai wand
        - 28254 # blorva helm
        - 28256 # blorva platebody
        - 28258 # blorva legs
        - 20366 # amulet of torture (or)
        - 22981 # ferocious gloves
        - 13239 # primordial boots
        - 25739 # sanguine scythe
        - 21295 # infernal cape
        - 29796 # nox hally
        - 29801 # amulet of rancour
        - 30753 # oathplate chest
        - 30750 # oathplate helm
        - 30756 # oathplate legs
        - 31097 # avernic treads (max)
        - 28338 # soulreaper axe
        - 23995 # blade of saeldor
        - 22322 # avernic defender
        - 31106 # confliction gauntlets

      - 808 # idle
      - 819 # walk
      - 824 # run
      - 820 # rotate 180
      - 822 # strafe left
      - 821 # strafe right
      - 426 # fire bow
      - 5061 # fire blowpipe
      - 7618 # throw chinchompa
      - 8057 # scythe idle
      - 8056 # scythe crush
      - 390 # sword slash
      - 440 # halberd slash
      - 813 # halberd idle
      - 10172 # soulreaper axe idle
      - 10169 # soulreaper axe slash
      - 4230 # fire crossbow
      - 1979 # barrage

### NPC models

    # Zuk: Idle, Fire, Flinch, Die
    npm run cmd modelBuilder npc 7706 anim 7564,7566,7565,7562 name zuk

    # Ranger: Idle, Walk, Range, Melee, Die, Flinch
    npm run cmd modelBuilder npc 7698 anim 7602,7603,7605,7604,7606,7607 name ranger

    # Mager: Idle, Walk, Mage, Revive Melee, Die
    npm run cmd modelBuilder npc 7699 anim 7609,7608,7610,7611,7612,7613 name mager

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

### Spotanim models

    npm run cmd modelBuilder spotanim 448 name jad_mage_front
    npm run cmd modelBuilder spotanim 449 name jad_mage_middle
    npm run cmd modelBuilder spotanim 450 name jad_mage_rear

    npm run cmd modelBuilder spotanim 451 name jad_range

    npm run cmd modelBuilder spotanim 301 name acb_spec

    npm run cmd modelBuilder spotanim 1120 name dragon_arrow
    npm run cmd modelBuilder spotanim 1122 name dragon_dart
    npm run cmd modelBuilder spotanim 1272 name black_chinchompa_projectile

    npm run cmd modelBuilder spotanim 1382 name bat_projectile
    npm run cmd modelBuilder spotanim 1378 name blob_range_projectile
    npm run cmd modelBuilder spotanim 1380 name blob_mage_projectile

    npm run cmd modelBuilder spotanim 1376 name mage_projectile
    npm run cmd modelBuilder spotanim 1377 name range_projectile
    npm run cmd modelBuilder spotanim 1375 name zuk_projectile

    # these look terrible with normal optimisation so we do this
    for file in tekton_meteor*.gltf; do
        gltf-transform optimize --simplify false --compress meshopt $file $(echo $file | sed 's/\.gltf$/\.glb/')
    done
    npm run cmd modelBuilder spotanim 660 name tekton_meteor
    npm run cmd modelBuilder spotanim 659 name tekton_meteor_splat

sounds
range and mage ATTACK  sound 598
death 598

zanik rez 1095 sound