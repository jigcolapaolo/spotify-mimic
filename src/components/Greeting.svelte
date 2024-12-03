<script lang="ts">
    const currentTime = new Date()
    const currentHour = currentTime.getHours()

    let greeting = ""

    if (currentHour < 6 || currentHour >= 18) {
        greeting = "Buenas noches 🌙"
    } else if (currentHour < 12) {
        greeting = "Buenos días ☀️"
    } else {
        greeting = "Buenas tardes 🌇"
    }
</script>

<h1 class="text-3xl font-bold">{greeting}</h1>