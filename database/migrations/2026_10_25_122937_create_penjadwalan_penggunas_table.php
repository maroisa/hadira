<?php

use App\Models\Jadwal;
use App\Models\Pengguna;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penjadwalan_penggunas', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Pengguna::class)->constrained();
            $table->foreignIdFor(Jadwal::class)->constrained();
            $table->foreignId('status_id')->constrained('status_jadwals');
            $table->date('tanggal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjadwalan_penggunas');
    }
};
