<script lang="ts">
  import type { Connection } from "$lib/interfaces/network";

  export let connection: Connection;
</script>

<line
  x1={connection.source.node.x}
  y1={connection.source.node.y}
  x2={connection.target.node.x}
  y2={connection.target.node.y}
  stroke="black"
/>
