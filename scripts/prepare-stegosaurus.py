"""Keep only the walk/idle clips from the CC0 Quaternius GLB; no geometry changes.

Usage: python scripts/prepare-stegosaurus.py input.glb public/models/stegosaurus.glb
Source and attribution: public/models/stegosaurus.LICENSE.txt
"""
import copy, json, struct, sys
from pathlib import Path

source = Path(sys.argv[1]).read_bytes()
assert source[:4] == b'glTF'
length, kind = struct.unpack_from('<II', source, 12)
assert kind == 0x4e4f534a
doc = json.loads(source[20:20+length])
offset = 20 + length
binary_length, kind = struct.unpack_from('<II', source, offset)
assert kind == 0x004e4942
binary = source[offset+8:offset+8+binary_length]
doc['animations'] = [a for a in doc['animations'] if a['name'] in ['Stegosaurus_Idle', 'Stegosaurus_Walk']]
assert len(doc['animations']) == 2
accessors = set()
for mesh in doc['meshes']:
    for primitive in mesh['primitives']:
        accessors.update(primitive['attributes'].values())
        accessors.add(primitive['indices'])
for skin in doc['skins']:
    accessors.add(skin['inverseBindMatrices'])
for animation in doc['animations']:
    for sampler in animation['samplers']:
        accessors.update([sampler['input'], sampler['output']])
mapping = {old: new for new, old in enumerate(sorted(accessors))}
views = sorted({doc['accessors'][old]['bufferView'] for old in accessors})
view_mapping, packed, new_views = {}, bytearray(), []
for old in views:
    view = copy.deepcopy(doc['bufferViews'][old])
    packed.extend(b'\0' * (-len(packed) % 4))
    start = view.get('byteOffset', 0)
    view['byteOffset'], view['buffer'] = len(packed), 0
    packed.extend(binary[start:start+view['byteLength']])
    view_mapping[old] = len(new_views)
    new_views.append(view)
doc['bufferViews'] = new_views
doc['accessors'] = [doc['accessors'][old] for old in sorted(accessors)]
for accessor in doc['accessors']:
    accessor['bufferView'] = view_mapping[accessor['bufferView']]
for mesh in doc['meshes']:
    for primitive in mesh['primitives']:
        primitive['attributes'] = {name: mapping[value] for name, value in primitive['attributes'].items()}
        primitive['indices'] = mapping[primitive['indices']]
for skin in doc['skins']:
    skin['inverseBindMatrices'] = mapping[skin['inverseBindMatrices']]
for animation in doc['animations']:
    for sampler in animation['samplers']:
        sampler['input'], sampler['output'] = mapping[sampler['input']], mapping[sampler['output']]
doc['buffers'] = [{'byteLength': len(packed)}]
doc['asset']['copyright'] = 'Stegosaurus by Quaternius, CC0 1.0; see stegosaurus.LICENSE.txt'
encoded = json.dumps(doc, separators=(',', ':')).encode()
encoded += b' ' * (-len(encoded) % 4)
packed.extend(b'\0' * (-len(packed) % 4))
output = struct.pack('<4sII', b'glTF', 2, 28 + len(encoded) + len(packed))
output += struct.pack('<II', len(encoded), 0x4e4f534a) + encoded
output += struct.pack('<II', len(packed), 0x004e4942) + packed
target = Path(sys.argv[2]); target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(output)
print(f'{len(source)} -> {len(output)} bytes; idle and walk retained')
