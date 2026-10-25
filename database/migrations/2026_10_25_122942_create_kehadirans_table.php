<?php

use App\Models\PenjadwalanPengguna;
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
        Schema::create('kehadirans', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(PenjadwalanPengguna::class)->constrained();
            $table->string('catatan');
            $table->timestamp('waktu_masuk');
            $table->timestamp('waktu_keluar');
            $table->string('lokasi_masuk');
            $table->string('lokasi_keluar');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kehadirans');
    }
};
